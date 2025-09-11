@echo off
setlocal EnableDelayedExpansion

:: =============================================================================
:: Script de Configuration Client DIOO - Windows
:: Description: Configuration automatique de l'accès SSH tunnel
:: Usage: setup-client.bat [SERVER_IP] [USERNAME]
:: =============================================================================

echo.
echo ===============================================
echo     DIOO - Configuration Client Windows
echo ===============================================
echo.

:: Configuration par défaut
set DEFAULT_SERVER=192.168.1.100
set DEFAULT_USER=client-demo
set INSTALL_DIR=C:\DIOO-Access

:: Vérifier les paramètres
if "%1"=="" (
    set /p SERVER_IP="Adresse IP du serveur DIOO [%DEFAULT_SERVER%]: "
    if "!SERVER_IP!"=="" set SERVER_IP=%DEFAULT_SERVER%
) else (
    set SERVER_IP=%1
)

if "%2"=="" (
    set /p USERNAME="Nom d'utilisateur SSH [%DEFAULT_USER%]: "
    if "!USERNAME!"=="" set USERNAME=%DEFAULT_USER%
) else (
    set USERNAME=%2
)

echo.
echo [INFO] Configuration:
echo   Serveur: %SERVER_IP%
echo   Utilisateur: %USERNAME%
echo   Dossier: %INSTALL_DIR%
echo.

:: Créer le dossier d'installation
echo [ETAPE 1] Creation du dossier d'installation...
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
    echo [OK] Dossier cree: %INSTALL_DIR%
) else (
    echo [OK] Dossier existe deja: %INSTALL_DIR%
)

:: Vérifier OpenSSH
echo.
echo [ETAPE 2] Verification d'OpenSSH...
where ssh >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] OpenSSH non detecte
    echo [INFO] Installation d'OpenSSH...
    
    :: Essayer d'installer via Windows Features
    dism /online /Enable-Feature /FeatureName:Microsoft-Windows-Subsystem-Linux /all /norestart >nul 2>nul
    
    echo [INFO] Veuillez installer OpenSSH manuellement:
    echo   1. Parametres ^> Applications ^> Fonctionnalites facultatives
    echo   2. Ajouter une fonctionnalite
    echo   3. Rechercher "OpenSSH Client" et installer
    echo.
    pause
) else (
    echo [OK] OpenSSH Client detecte
)

:: Créer le script de connexion personnalisé
echo.
echo [ETAPE 3] Creation du script de connexion...

set CONNECT_SCRIPT=%INSTALL_DIR%\connect-dioo.bat

(
echo @echo off
echo setlocal EnableDelayedExpansion
echo.
echo :: =============================================================================
echo :: DIOO - Script de Connexion Client Personnalise
echo :: Genere automatiquement par setup-client.bat
echo :: =============================================================================
echo.
echo :: Configuration personnalisee
echo set SERVER_HOST=%SERVER_IP%
echo set USERNAME=%USERNAME%
echo set SSH_KEY=%INSTALL_DIR%\dioo-key.pem
echo set LOCAL_PORT=3020
echo.
echo echo.
echo echo ===============================================
echo echo         DIOO - Connexion Client Securisee
echo echo ===============================================
echo echo.
echo.
echo :: Verifier la presence de la cle SSH
echo if not exist "%%SSH_KEY%%" ^(
echo     echo [ERROR] Cle SSH non trouvee : %%SSH_KEY%%
echo     echo [INFO] Contactez votre administrateur pour obtenir la cle
echo     echo [INFO] La cle doit etre placee dans : %%SSH_KEY%%
echo     pause
echo     exit /b 1
echo ^)
echo.
echo :: Verifier si le port local est libre
echo netstat -an 2^>nul ^| findstr :%%LOCAL_PORT%% ^>nul
echo if %%errorlevel%% equ 0 ^(
echo     echo [WARNING] Port %%LOCAL_PORT%% deja utilise
echo     echo [INFO] Fermeture des connexions existantes...
echo     
echo     for /f "tokens=5" %%%%i in ^('netstat -ano 2^^^>nul ^^^| findstr :%%LOCAL_PORT%%'^) do ^(
echo         if "%%%%i" neq "" if "%%%%i" neq "0" ^(
echo             taskkill /F /PID %%%%i ^>nul 2^>nul
echo         ^)
echo     ^)
echo     timeout /t 2 /nobreak ^>nul
echo ^)
echo.
echo echo [INFO] Connexion au serveur DIOO...
echo echo [INFO] Serveur: %%SERVER_HOST%%
echo echo [INFO] Utilisateur: %%USERNAME%%
echo echo [INFO] Port local: %%LOCAL_PORT%%
echo echo.
echo.
echo :: Creer le tunnel SSH
echo echo [INFO] Etablissement du tunnel securise...
echo start "DIOO SSH Tunnel" /MIN ssh -i "%%SSH_KEY%%" -L %%LOCAL_PORT%%:localhost:3020 -N %%USERNAME%%@%%SERVER_HOST%%
echo.
echo :: Attendre que le tunnel soit etabli
echo echo [INFO] Verification de la connexion...
echo set /a "tentatives=0"
echo.
echo :check_tunnel
echo set /a "tentatives+=1"
echo timeout /t 2 /nobreak ^>nul
echo.
echo netstat -an 2^>nul ^| findstr :%%LOCAL_PORT%% ^>nul
echo if %%errorlevel%% equ 0 ^(
echo     echo [OK] Tunnel SSH etabli avec succes !
echo     goto :open_browser
echo ^)
echo.
echo if %%tentatives%% lss 10 ^(
echo     echo [INFO] Tentative %%tentatives%%/10...
echo     goto :check_tunnel
echo ^)
echo.
echo echo [ERROR] Impossible d'etablir le tunnel SSH
echo echo [INFO] Verifiez votre connexion internet et contactez l'administrateur
echo pause
echo exit /b 1
echo.
echo :open_browser
echo echo.
echo echo ===============================================
echo echo           DIOO - Acces Securise Pret
echo echo ===============================================
echo echo.
echo.
echo set URL=http://localhost:%%LOCAL_PORT%%
echo echo [OK] Application DIOO accessible sur: %%URL%%
echo echo [INFO] Ouverture automatique du navigateur...
echo.
echo :: Ouvrir le navigateur
echo start "" "%%URL%%"
echo.
echo echo.
echo echo ===============================================
echo echo              INFORMATIONS CLIENT
echo echo ===============================================
echo echo.
echo echo URL d'acces: %%URL%%
echo echo Serveur distant: %%SERVER_HOST%%
echo echo Utilisateur: %%USERNAME%%
echo echo Connexion etablie: %%date%% %%time%%
echo echo.
echo echo IMPORTANT:
echo echo - Gardez cette fenetre ouverte pendant votre session
echo echo - Fermez cette fenetre pour deconnecter
echo echo - En cas de probleme, contactez l'administrateur
echo echo.
echo echo ===============================================
echo echo         Session DIOO Active - Ne pas fermer
echo echo ===============================================
echo echo.
echo.
echo :: Maintenir la connexion active
echo echo [INFO] Session active - Appuyez sur Ctrl+C pour deconnecter
echo :keep_alive
echo timeout /t 30 /nobreak ^>nul
echo netstat -an 2^>nul ^| findstr :%%LOCAL_PORT%% ^>nul
echo if %%errorlevel%% neq 0 ^(
echo     echo [WARNING] Connexion perdue - Tentative de reconnexion...
echo     goto :check_tunnel
echo ^)
echo goto :keep_alive
echo.
echo endlocal
) > "%CONNECT_SCRIPT%"

echo [OK] Script de connexion cree: %CONNECT_SCRIPT%

:: Créer un fichier d'instructions
echo.
echo [ETAPE 4] Creation du fichier d'instructions...

set INSTRUCTIONS=%INSTALL_DIR%\INSTRUCTIONS.txt

(
echo ===============================================
echo     DIOO - Instructions d'Installation Client
echo ===============================================
echo.
echo CONFIGURATION AUTOMATIQUE TERMINEE
echo.
echo Serveur DIOO: %SERVER_IP%
echo Utilisateur SSH: %USERNAME%
echo Dossier d'installation: %INSTALL_DIR%
echo.
echo PROCHAINES ETAPES:
echo.
echo 1. RECEVOIR LA CLE SSH
echo    - Contactez votre administrateur
echo    - Demandez la cle SSH privee pour l'utilisateur: %USERNAME%
echo    - Placez la cle dans: %INSTALL_DIR%\dioo-key.pem
echo.
echo 2. TESTER LA CONNEXION
echo    - Double-cliquez sur: %INSTALL_DIR%\connect-dioo.bat
echo    - Le navigateur doit s'ouvrir automatiquement sur DIOO
echo.
echo 3. CREER UN RACCOURCI BUREAU ^(OPTIONNEL^)
echo    - Clic droit sur le bureau ^> Nouveau ^> Raccourci
echo    - Cible: %INSTALL_DIR%\connect-dioo.bat
echo    - Nom: "Acces DIOO Securise"
echo.
echo DEPANNAGE:
echo.
echo - Si "Permission denied": Verifiez que la cle SSH est correcte
echo - Si "Connection refused": Verifiez l'adresse IP du serveur
echo - Si "Port already in use": Fermez les autres connexions DIOO
echo.
echo SUPPORT:
echo Contactez votre administrateur systeme en cas de probleme.
echo.
echo ===============================================
echo Configuration generee le: %date% %time%
echo ===============================================
) > "%INSTRUCTIONS%"

echo [OK] Instructions creees: %INSTRUCTIONS%

:: Créer un raccourci bureau (optionnel)
echo.
echo [ETAPE 5] Creation du raccourci bureau...

set /p CREATE_SHORTCUT="Creer un raccourci sur le bureau ? (y/n) [y]: "
if "%CREATE_SHORTCUT%"=="" set CREATE_SHORTCUT=y

if /i "%CREATE_SHORTCUT%"=="y" (
    :: Utiliser PowerShell pour créer le raccourci
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Acces DIOO Securise.lnk'); $Shortcut.TargetPath = '%CONNECT_SCRIPT%'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Connexion securisee a DIOO via SSH Tunnel'; $Shortcut.Save()" 2>nul
    
    if %errorlevel% equ 0 (
        echo [OK] Raccourci cree sur le bureau
    ) else (
        echo [WARNING] Impossible de creer le raccourci automatiquement
        echo [INFO] Vous pouvez le creer manuellement:
        echo   Cible: %CONNECT_SCRIPT%
    )
) else (
    echo [INFO] Raccourci bureau ignore
)

:: Résumé final
echo.
echo ===============================================
echo        CONFIGURATION CLIENT TERMINEE
echo ===============================================
echo.
echo [SUCCES] Configuration terminee avec succes !
echo.
echo FICHIERS CREES:
echo   Script de connexion: %CONNECT_SCRIPT%
echo   Instructions: %INSTRUCTIONS%
if /i "%CREATE_SHORTCUT%"=="y" echo   Raccourci bureau: Acces DIOO Securise.lnk
echo.
echo PROCHAINE ETAPE:
echo   1. Recevez la cle SSH de votre administrateur
echo   2. Placez-la dans: %INSTALL_DIR%\dioo-key.pem
echo   3. Double-cliquez sur le raccourci ou executez: %CONNECT_SCRIPT%
echo.
echo [INFO] Consultez %INSTRUCTIONS% pour plus de details
echo.

:: Ouvrir le dossier d'installation
set /p OPEN_FOLDER="Ouvrir le dossier d'installation ? (y/n) [y]: "
if "%OPEN_FOLDER%"=="" set OPEN_FOLDER=y

if /i "%OPEN_FOLDER%"=="y" (
    start "" "%INSTALL_DIR%"
)

echo.
echo [INFO] Configuration terminee. Appuyez sur une touche pour quitter.
pause >nul

endlocal