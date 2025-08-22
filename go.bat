@echo off
setlocal EnableDelayedExpansion

:: =============================================================================
:: Script de lancement YesData Frequentation
:: Description: Lance l'application YesData Frequentation (WinPharma) sur les ports 3020 et 3021
:: Auteur: Nicolas Steffan
:: Version: 2.2.0 - Traitement par paquets pour gros fichiers + capture erreurs
:: =============================================================================

:: Centrer la fenêtre DOS actuelle
mode con: cols=100 lines=30

echo.
echo ===============================================
echo    YesData Frequentation - Lancement de l'application
echo ===============================================
echo.

:: Configuration
set PORT_MAIN=3020
set PORT_ALT=3021
set APP_NAME=YesData Frequentation
set URL_MAIN=http://localhost:%PORT_MAIN%
set URL_ALT=http://localhost:%PORT_ALT%

:: ETAPE 1: ARRETER LES SERVEURS EXISTANTS
echo [ETAPE 1] Arret des serveurs existants...
echo [INFO] Recherche des processus sur les ports %PORT_MAIN% et %PORT_ALT%...

:: Fonction d'arrêt intégrée (fusion de stop.bat)
:: Arrêt des processus sur le port principal
for /f "tokens=5" %%i in ('netstat -ano 2^>nul ^| findstr :%PORT_MAIN%') do (
    if "%%i" neq "" if "%%i" neq "0" (
        echo [INFO] Arret du processus %%i sur port %PORT_MAIN%...
        taskkill /F /PID %%i >nul 2>nul
        if not errorlevel 1 (
            echo [OK] Processus %%i arrete
        ) else (
            echo [WARNING] Impossible d'arreter le processus %%i
        )
    )
)

:: Arrêt des processus sur le port alternatif
for /f "tokens=5" %%i in ('netstat -ano 2^>nul ^| findstr :%PORT_ALT%') do (
    if "%%i" neq "" if "%%i" neq "0" (
        echo [INFO] Arret du processus %%i sur port %PORT_ALT%...
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
netstat -an 2>nul | findstr :%PORT_MAIN% >nul
set main_free=%errorlevel%
netstat -an 2>nul | findstr :%PORT_ALT% >nul
set alt_free=%errorlevel%

if %main_free% neq 0 if %alt_free% neq 0 (
    echo [OK] Aucun serveur actif sur les ports %PORT_MAIN% et %PORT_ALT%
) else (
    echo [WARNING] Des processus peuvent encore utiliser les ports
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
echo [INFO] Demarrage sur le port principal %PORT_MAIN%...

:: Lancer le serveur principal en arrière-plan
start "YesData Server Main" /MIN cmd /c "http-server . -p %PORT_MAIN% -c-1 --cors --silent"

:: Optionnel: Lancer aussi un serveur alternatif (commenté par défaut)
:: start "YesData Server Alt" /MIN cmd /c "http-server . -p %PORT_ALT% -c-1 --cors --silent"

:: Attendre que le serveur démarre
echo [INFO] Attente du demarrage du serveur...
set /a "tentatives=0"

:check_server
set /a "tentatives+=1"
timeout /t 1 /nobreak >nul

netstat -an 2>nul | findstr :%PORT_MAIN% >nul
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
echo      APPLICATION YESDATA FREQUENTATION PRETE
echo ===============================================
echo.
echo [OK] Serveur principal lance sur: %URL_MAIN%
echo [INFO] Port alternatif disponible: %URL_ALT%
echo [INFO] Ouverture du navigateur...

:: ETAPE 4: OUVERTURE DU NAVIGATEUR
echo [ETAPE 4] Ouverture du navigateur...

:: Essayer Edge en premier
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Ouverture avec Microsoft Edge...
    start "" msedge "%URL_MAIN%"
    echo [OK] Application ouverte dans Edge
    goto :success
)

:: Essayer Chrome en deuxième
where chrome >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Edge non trouve, ouverture avec Chrome...
    start "" chrome "%URL_MAIN%"
    echo [OK] Application ouverte dans Chrome
    goto :success
)

:: Fallback sur le navigateur par défaut
echo [INFO] Edge et Chrome non trouves, navigateur par defaut...
start "" "%URL_MAIN%"
echo [OK] Application ouverte dans le navigateur par defaut

:success
echo.
echo ===============================================
echo              INFORMATIONS UTILES
echo ===============================================
echo.
echo URL principale: %URL_MAIN%
echo URL alternative: %URL_ALT%
echo Ports utilises: %PORT_MAIN% (principal), %PORT_ALT% (alternatif)
echo Repertoire: %~dp0
echo Heure de lancement: %date% %time%
echo.
echo Commandes utiles:
echo - Ctrl+C dans la fenetre serveur pour arreter
echo - F5 dans le navigateur pour actualiser
echo - Alt+1 : Module Chargement (fichiers WinPharma)
echo - Alt+2 : Module Monitoring
echo.
echo Formats supportes:
echo - CSV WinPharma : Separateur point-virgule (;)
echo.
echo Nouveautes v2.2.0:
echo - TRAITEMENT PAR PAQUETS: gros fichiers CSV traites par blocs de 1000 lignes
echo - DETECTION AUTOMATIQUE: fichiers >2MB ou >5000 lignes = mode paquets
echo - PROGRESSION EN TEMPS REEL: indicateur de progression par paquet
echo - SAUVEGARDE OPTIMISEE: metadata + echantillon pour gros fichiers
echo - PLUS D'ERREUR QUOTA: contournement limite localStorage (5-10MB)
echo - PERFORMANCE AMELIOREE: traitement asynchrone sans blocage interface
echo - SUPPORT FICHIERS VOLUMINEUX: jusqu'a plusieurs dizaines de MB
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