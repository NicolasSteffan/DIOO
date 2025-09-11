@echo off
setlocal EnableDelayedExpansion

:: =============================================================================
:: Script de lancement DIOO - Point d'entrée unique
:: Description: Lance l'application DIOO sur le port 3020
:: Auteur: Nicolas Steffan
:: Version: 1.2.0 - Solution 1 SSH Tunnel Ready
:: Conforme à la bible du projet - POO + Structure organisée
:: =============================================================================

:: Centrer la fenêtre DOS actuelle
mode con: cols=100 lines=30

echo.
echo ===============================================
echo         DIOO - Lancement de l'application
echo ===============================================
echo.

:: Configuration
set PORT=3020
set APP_NAME=DIOO
set URL=http://localhost:%PORT%

:: ETAPE 1: ARRETER LES SERVEURS EXISTANTS
echo [ETAPE 1] Arret des serveurs existants...
echo [INFO] Recherche des processus sur le port %PORT%...

:: Fonction d'arrêt intégrée (fusion de stop.bat)
for /f "tokens=5" %%i in ('netstat -ano 2^>nul ^| findstr :%PORT%') do (
    if "%%i" neq "" if "%%i" neq "0" (
        echo [INFO] Arret du processus %%i...
        taskkill /F /PID %%i >nul 2>nul
        if not errorlevel 1 (
            echo [OK] Processus %%i arrete
        ) else (
            echo [WARNING] Impossible d'arreter le processus %%i
        )
    )
)

:: Vérification finale
timeout /t 2 /nobreak >nul
netstat -an 2>nul | findstr :%PORT% >nul
if %errorlevel% neq 0 (
    echo [OK] Aucun serveur actif sur le port %PORT%
) else (
    echo [WARNING] Des processus peuvent encore utiliser le port %PORT%
)

echo [OK] Nettoyage termine

echo.
echo ===============================================

:: ETAPE 2: VERIFICATION DES PREREQUIS
echo [ETAPE 2] Verification des prerequis...

:: Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js non detecte
    echo [INFO] Veuillez installer Node.js pour continuer
    goto :manual_launch
)

echo [OK] Node.js detecte
node --version

:: Vérifier/installer http-server
echo [INFO] Verification de http-server...
call npm list -g http-server >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installation de http-server...
    call npm install -g http-server
    if %errorlevel% neq 0 (
        echo [ERROR] Echec de l'installation de http-server
        goto :manual_launch
    )
)

echo [OK] http-server pret

echo.
echo ===============================================

:: ETAPE 3: LANCEMENT DU SERVEUR
echo [ETAPE 3] Lancement du serveur...
echo [INFO] Demarrage sur le port %PORT%...

:: Lancer le serveur en arrière-plan
start "DIOO Server" /MIN cmd /c "set NODE_NO_WARNINGS=1 && http-server . -p %PORT% -c-1 --cors --silent"

:: Attendre que le serveur démarre
echo [INFO] Attente du demarrage du serveur...
set /a "tentatives=0"

:check_server
set /a "tentatives+=1"
timeout /t 1 /nobreak >nul

netstat -an 2>nul | findstr :%PORT% >nul
if %errorlevel% equ 0 (
    echo [OK] Serveur demarre avec succes !
    goto :open_browser
)

if %tentatives% lss 10 (
    echo [INFO] Tentative %tentatives%/10...
    goto :check_server
)

echo [ERROR] Le serveur n'a pas pu demarrer
goto :manual_launch

:open_browser
echo.
echo ===============================================
echo           APPLICATION DIOO PRETE
echo ===============================================
echo.
echo [OK] Serveur lance sur: %URL%
echo [INFO] Ouverture du navigateur...

:: ETAPE 4: OUVERTURE DU NAVIGATEUR
echo [ETAPE 4] Ouverture du navigateur...

:: Essayer Edge en premier
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Ouverture avec Microsoft Edge...
    start "" msedge "%URL%"
    echo [OK] Application ouverte dans Edge
    goto :success
)

:: Essayer Chrome en deuxième
where chrome >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Edge non trouve, ouverture avec Chrome...
    start "" chrome "%URL%"
    echo [OK] Application ouverte dans Chrome
    goto :success
)

:: Fallback sur le navigateur par défaut
echo [INFO] Edge et Chrome non trouves, navigateur par defaut...
start "" "%URL%"
echo [OK] Application ouverte dans le navigateur par defaut

:success
echo.
echo ===============================================
echo              INFORMATIONS UTILES
echo ===============================================
echo.
echo URL de l'application: %URL%
echo Port utilise: %PORT%
echo Repertoire: %~dp0
echo Heure de lancement: %date% %time%
echo.
echo Commandes utiles:
echo - Ctrl+C dans la fenetre serveur pour arreter
echo - F5 dans le navigateur pour actualiser
echo - Alt+1 : Module Chargement
echo - Alt+2 : Module Monitoring
echo.
echo ===============================================
echo        SOLUTION 1 SSH TUNNEL - READY
echo ===============================================
echo.
echo [INFO] Pour serveur headless Ubuntu, utilisez:
echo   1. Copiez ce projet sur Ubuntu
echo   2. Executez: chmod +x go.sh ^&^& ./go.sh
echo   3. Le script detectera automatiquement l'environnement
echo   4. Instructions SSH tunnel affichees automatiquement
echo.
echo [INFO] Architecture conforme bible du projet:
echo   - POO avec classes et methodes claires
echo   - Structure organisee en dossiers logiques
echo   - CSS separe dans style/ClaudS4/
echo   - Point d'entree unique: go.bat (Windows) / go.sh (Ubuntu)
echo.
echo ===============================================
echo             APPLICATION LANCEE
echo ===============================================
echo.
echo [INFO] Le serveur fonctionne en arriere-plan
echo [INFO] Vous pouvez fermer cette fenetre
echo [INFO] Pour arreter: Ctrl+C dans la fenetre serveur
echo.
echo [INFO] Lancement automatique termine - Fermeture dans 3 secondes...
timeout /t 3 /nobreak >nul
goto :end

:manual_launch
echo.
echo ===============================================
echo            LANCEMENT MANUEL
echo ===============================================
echo.
echo Impossible de lancer automatiquement.
echo.
echo Options manuelles:
echo 1. Installer Node.js puis relancer ce script
echo 2. Ouvrir index.html directement dans un navigateur
echo.
echo URL locale: file:///%~dp0index.html
echo.
echo [INFO] Fermeture automatique dans 5 secondes...
timeout /t 5 /nobreak >nul

:end
endlocal