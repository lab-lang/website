# Installs lab, labc, and lab-opt from the latest GitHub release of
# lab-lang/lab.
#
#   irm https://lab-lang.org/install.ps1 | iex
#
# Environment overrides:
#   LAB_VERSION        Install a specific tag (e.g. v0.2.0) instead of latest.
#   LAB_INSTALL_DIR    Install directory. Defaults to $env:USERPROFILE\.lab\bin.
#   LAB_NO_MODIFY_PATH Set to skip touching the user PATH.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Repo = "lab-lang/lab"
$Target = "x86_64-pc-windows-msvc"
$Asset = "lab-$Target.tar.gz"
$InstallDir = if ($env:LAB_INSTALL_DIR) { $env:LAB_INSTALL_DIR } else { Join-Path $env:USERPROFILE ".lab\bin" }

if (-not (Get-Command tar -ErrorAction SilentlyContinue)) {
    throw "need 'tar' (ships with Windows 10 1803+); download a binary from https://github.com/$Repo/releases instead"
}

$BaseUrl = if ($env:LAB_VERSION) {
    "https://github.com/$Repo/releases/download/$($env:LAB_VERSION)"
} else {
    "https://github.com/$Repo/releases/latest/download"
}

$TmpDir = Join-Path ([System.IO.Path]::GetTempPath()) "lab-install-$([guid]::NewGuid())"
New-Item -ItemType Directory -Path $TmpDir | Out-Null

try {
    Write-Host "Downloading $Asset..."
    Invoke-WebRequest -Uri "$BaseUrl/$Asset" -OutFile (Join-Path $TmpDir $Asset) -UseBasicParsing
    Invoke-WebRequest -Uri "$BaseUrl/SHA256SUMS" -OutFile (Join-Path $TmpDir "SHA256SUMS") -UseBasicParsing

    $checksumLine = Get-Content (Join-Path $TmpDir "SHA256SUMS") |
        Where-Object { ($_ -split '\s+')[1] -eq $Asset } |
        Select-Object -First 1
    if (-not $checksumLine) {
        throw "no checksum entry for $Asset in SHA256SUMS"
    }
    $expected = ($checksumLine -split '\s+')[0]
    $actual = (Get-FileHash (Join-Path $TmpDir $Asset) -Algorithm SHA256).Hash.ToLower()
    if ($actual -ne $expected) {
        throw "checksum mismatch for $Asset`: expected $expected, got $actual"
    }

    tar -xzf (Join-Path $TmpDir $Asset) -C $TmpDir
    if ($LASTEXITCODE -ne 0) {
        throw "failed to extract $Asset"
    }

    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    foreach ($bin in "lab.exe", "labc.exe", "lab-opt.exe") {
        Move-Item -Force (Join-Path $TmpDir $bin) (Join-Path $InstallDir $bin)
    }

    Write-Host "Installed lab, labc, and lab-opt to $InstallDir"

    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $alreadyOnPath = $userPath -and (($userPath -split ';') -contains $InstallDir)

    if ($alreadyOnPath) {
        # already configured
    } elseif ($env:LAB_NO_MODIFY_PATH) {
        Write-Host ""
        Write-Host "$InstallDir is not on your PATH. Add it in System Properties, or run:"
        Write-Host "  [Environment]::SetEnvironmentVariable('Path', `"`$env:Path;$InstallDir`", 'User')"
    } else {
        $newPath = if ($userPath) { "$userPath;$InstallDir" } else { $InstallDir }
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        $env:Path = "$env:Path;$InstallDir"
        Write-Host ""
        Write-Host "Added $InstallDir to your user PATH. Open a new terminal to pick it up."
    }

    Write-Host ""
    Write-Host "Run 'lab update' any time to install a newer release."
} finally {
    Remove-Item -Recurse -Force $TmpDir -ErrorAction SilentlyContinue
}
