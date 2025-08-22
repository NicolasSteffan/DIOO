@echo off
setlocal

:: =============================================================================
:: Script de configuration YesData Frequentation
:: Description: Configure l'environnement pour l'application YesData Frequentation
:: =============================================================================

echo.
echo ===============================================
echo       YesData Frequentation - Configuration de l'environnement
echo ===============================================
echo.

:: Vérifier Node.js
echo [INFO] Verification de Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js detecte
    node --version
    
    echo [INFO] Verification de npm...
    where npm >nul 2>nul
    if %errorlevel% equ 0 (
        echo [OK] npm detecte
        npm --version
        
        echo [INFO] Installation de http-server...
        call npm install -g http-server
        if %errorlevel% equ 0 (
            echo [OK] http-server installe avec succes
        ) else (
            echo [WARNING] Probleme avec l'installation de http-server
        )
    )
) else (
    echo [INFO] Node.js non detecte
)

:: Vérifier Python
echo.
echo [INFO] Verification de Python...
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python detecte
    python --version
) else (
    echo [INFO] Python non detecte
)

echo.
echo ===============================================
echo            CONFIGURATION TERMINEE
echo ===============================================
echo.
echo L'environnement est configure.
echo Vous pouvez maintenant lancer: go.bat
echo.
pause