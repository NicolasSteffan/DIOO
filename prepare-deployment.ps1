# =============================================================================
# Script de Préparation de Déploiement DIOO
# Description: Prépare et transfère le package Docker Alpine depuis Windows
# Usage: .\prepare-deployment.ps1 -ServerIP "IP" -Username "user" -Domain "domain.com" -Email "email@domain.com"
# =============================================================================

param(
    [Parameter(Mandatory=$true, HelpMessage="Adresse IP du serveur Ubuntu")]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true, HelpMessage="Nom d'utilisateur SSH")]
    [string]$Username,
    
    [Parameter(Mandatory=$true, HelpMessage="Nom de domaine pour HTTPS")]
    [string]$Domain,
    
    [Parameter(Mandatory=$true, HelpMessage="Email pour Let's Encrypt")]
    [string]$Email,
    
    [Parameter(Mandatory=$false, HelpMessage="Ignorer la configuration SSL")]
    [switch]$SkipSSL,
    
    [Parameter(Mandatory=$false, HelpMessage="Mode test (dry-run)")]
    [switch]$DryRun
)

# Couleurs pour PowerShell
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success { Write-ColorOutput Green $args }
function Write-Warning { Write-ColorOutput Yellow $args }
function Write-Error { Write-ColorOutput Red $args }
function Write-Info { Write-ColorOutput Cyan $args }

# Bannière
Write-Host ""
Write-Info "==============================================="
Write-Info "    DIOO - Préparation Déploiement Docker"
Write-Info "==============================================="
Write-Host ""

Write-Info "Configuration :"
Write-Host "  Serveur Ubuntu : $ServerIP"
Write-Host "  Utilisateur SSH : $Username"
Write-Host "  Domaine : $Domain"
Write-Host "  Email : $Email"
Write-Host "  Ignorer SSL : $SkipSSL"
Write-Host "  Mode test : $DryRun"
Write-Host ""

# ÉTAPE 1: Vérifications préalables
Write-Info "[ÉTAPE 1] Vérifications préalables..."

# Vérifier SSH/SCP
try {
    $sshVersion = ssh -V 2>&1
    Write-Success "✓ SSH disponible"
} catch {
    Write-Error "✗ SSH non disponible"
    Write-Warning "Installez OpenSSH Client depuis les fonctionnalités Windows optionnelles"
    exit 1
}

# Vérifier la connectivité
Write-Host "Test de connectivité vers $ServerIP..."
if (Test-Connection -ComputerName $ServerIP -Count 2 -Quiet) {
    Write-Success "✓ Serveur accessible"
} else {
    Write-Warning "⚠ Serveur non accessible (peut être normal si ping désactivé)"
}

# ÉTAPE 2: Préparation du package
Write-Info "[ÉTAPE 2] Création du package de déploiement..."

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageName = "dioo-deployment-$timestamp"
$tempDir = Join-Path $env:TEMP $packageName

# Créer le dossier temporaire
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Fichiers Docker à copier
$dockerFiles = @(
    "Dockerfile.alpine",
    "docker-compose.alpine.yml",
    "nginx.alpine.conf",
    "nginx.site.conf",
    "deploy-alpine.sh"
)

# Fichiers DIOO à copier
$diooFiles = @(
    "index.html",
    "go.sh",
    "stop.sh",
    "sql-wasm.js",
    "sql-wasm.wasm",
    "scripts",
    "styles"
)

Write-Host "Copie des fichiers Docker..."
foreach ($file in $dockerFiles) {
    if (Test-Path $file) {
        Copy-Item $file $tempDir -Force
        Write-Success "  ✓ $file"
    } else {
        Write-Error "  ✗ $file manquant"
        Write-Warning "Assurez-vous d'avoir tous les fichiers Docker nécessaires"
        exit 1
    }
}

Write-Host "Copie des fichiers DIOO..."
foreach ($file in $diooFiles) {
    if (Test-Path $file) {
        Copy-Item $file $tempDir -Recurse -Force
        Write-Success "  ✓ $file"
    } else {
        Write-Warning "  ⚠ $file non trouvé (peut être optionnel)"
    }
}

# ÉTAPE 3: Création des scripts de configuration
Write-Info "[ÉTAPE 3] Génération des scripts de configuration..."

# Script de déploiement automatique
$autoDeployScript = @"
#!/bin/bash
# Script de déploiement automatique généré depuis Windows
# Configuration pour $Domain

set -e

# Configuration
DOMAIN="$Domain"
EMAIL="$Email"
SKIP_SSL=$($SkipSSL.ToString().ToLower())
DRY_RUN=$($DryRun.ToString().ToLower())

echo "=== Configuration de Déploiement ==="
echo "Domaine: `$DOMAIN"
echo "Email: `$EMAIL"
echo "Ignorer SSL: `$SKIP_SSL"
echo "Mode test: `$DRY_RUN"
echo ""

# Rendre les scripts exécutables
chmod +x *.sh

# Options de déploiement
DEPLOY_OPTIONS="-d `$DOMAIN -e `$EMAIL"

if [ "`$SKIP_SSL" = "true" ]; then
    DEPLOY_OPTIONS="`$DEPLOY_OPTIONS --skip-ssl"
fi

if [ "`$DRY_RUN" = "true" ]; then
    DEPLOY_OPTIONS="`$DEPLOY_OPTIONS --dry-run"
fi

echo "Lancement du déploiement avec les options: `$DEPLOY_OPTIONS"
echo ""

# Lancer le déploiement
./deploy-alpine.sh `$DEPLOY_OPTIONS
"@

$autoDeployScript | Out-File -FilePath "$tempDir/auto-deploy.sh" -Encoding UTF8

# Script de gestion rapide
$manageScript = @"
#!/bin/bash
# Script de gestion DIOO Docker

case "`$1" in
    start)
        echo "Démarrage de DIOO..."
        docker-compose up -d
        echo "DIOO démarré. Accès: https://$Domain"
        ;;
    stop)
        echo "Arrêt de DIOO..."
        docker-compose down
        echo "DIOO arrêté."
        ;;
    restart)
        echo "Redémarrage de DIOO..."
        docker-compose restart
        echo "DIOO redémarré."
        ;;
    logs)
        echo "Logs de DIOO (Ctrl+C pour quitter):"
        docker-compose logs -f `${2:-}
        ;;
    status)
        echo "Statut des containers DIOO:"
        docker-compose ps
        ;;
    update)
        echo "Mise à jour de DIOO..."
        docker-compose build --no-cache
        docker-compose up -d
        echo "DIOO mis à jour."
        ;;
    backup)
        BACKUP_FILE="dioo-backup-`$(date +%Y%m%d-%H%M%S).tar.gz"
        echo "Sauvegarde dans `$BACKUP_FILE..."
        tar -czf "`$BACKUP_FILE" ssl/ nginx/ docker-compose.yml
        echo "Sauvegarde terminée: `$BACKUP_FILE"
        ;;
    ssl-renew)
        echo "Renouvellement du certificat SSL..."
        docker-compose run --rm certbot renew
        docker-compose exec nginx nginx -s reload
        echo "Certificat SSL renouvelé."
        ;;
    *)
        echo "Usage: `$0 {start|stop|restart|logs|status|update|backup|ssl-renew}"
        echo ""
        echo "Commandes disponibles:"
        echo "  start      - Démarrer DIOO"
        echo "  stop       - Arrêter DIOO"
        echo "  restart    - Redémarrer DIOO"
        echo "  logs       - Voir les logs"
        echo "  status     - Voir le statut"
        echo "  update     - Mettre à jour"
        echo "  backup     - Sauvegarder"
        echo "  ssl-renew  - Renouveler SSL"
        exit 1
        ;;
esac
"@

$manageScript | Out-File -FilePath "$tempDir/manage.sh" -Encoding UTF8

# README de déploiement
$readmeContent = @"
# Déploiement DIOO Docker Alpine

## Configuration
- Domaine: $Domain
- Email: $Email
- Généré le: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Déploiement Rapide
```bash
# Déploiement automatique
./auto-deploy.sh

# OU déploiement manuel
./deploy-alpine.sh -d $Domain -e $Email
```

## Gestion
```bash
# Démarrer
./manage.sh start

# Arrêter  
./manage.sh stop

# Voir les logs
./manage.sh logs

# Statut
./manage.sh status
```

## Accès
- Application: https://$Domain
- Logs: ./manage.sh logs
- Gestion: ./manage.sh

## Dépannage
- Vérifier Docker: docker --version
- Vérifier les containers: docker-compose ps
- Voir les logs d'erreur: docker-compose logs
"@

$readmeContent | Out-File -FilePath "$tempDir/README-DEPLOYMENT.md" -Encoding UTF8

Write-Success "✓ Scripts de configuration générés"

# ÉTAPE 4: Création de l'archive
Write-Info "[ÉTAPE 4] Création de l'archive..."

$archivePath = "$packageName.zip"
if (Test-Path $archivePath) {
    Remove-Item $archivePath -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $archivePath -CompressionLevel Optimal
Write-Success "✓ Archive créée: $archivePath"

# ÉTAPE 5: Transfert vers Ubuntu
Write-Info "[ÉTAPE 5] Transfert vers le serveur Ubuntu..."

try {
    # Test de connexion SSH
    Write-Host "Test de connexion SSH..."
    $sshTest = ssh -o ConnectTimeout=10 -o BatchMode=yes "${Username}@${ServerIP}" "echo 'SSH OK'" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Connexion SSH réussie"
        
        # Transfert du fichier
        Write-Host "Transfert du package..."
        scp $archivePath "${Username}@${ServerIP}:~/"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✓ Transfert réussi"
            
            # Commandes de déploiement à distance
            $remoteCommands = @"
cd ~
unzip -o $archivePath
cd $packageName
chmod +x *.sh
echo ""
echo "=== Package DIOO prêt pour déploiement ==="
echo "Fichiers disponibles:"
ls -la
echo ""
echo "Pour déployer automatiquement:"
echo "  ./auto-deploy.sh"
echo ""
echo "Pour déployer manuellement:"
echo "  ./deploy-alpine.sh -d $Domain -e $Email"
echo ""
"@
            
            Write-Info "[ÉTAPE 6] Préparation sur le serveur..."
            ssh "${Username}@${ServerIP}" $remoteCommands
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "✓ Préparation terminée sur le serveur"
                
                # Proposer le déploiement immédiat
                Write-Host ""
                Write-Info "=== Options de Déploiement ==="
                Write-Host "1. Déploiement automatique maintenant"
                Write-Host "2. Connexion SSH pour déploiement manuel"
                Write-Host "3. Quitter (déploiement plus tard)"
                Write-Host ""
                
                $choice = Read-Host "Votre choix (1-3)"
                
                switch ($choice) {
                    "1" {
                        Write-Info "Lancement du déploiement automatique..."
                        ssh -t "${Username}@${ServerIP}" "cd $packageName && ./auto-deploy.sh"
                    }
                    "2" {
                        Write-Info "Connexion SSH pour déploiement manuel..."
                        Write-Host "Commandes utiles une fois connecté:"
                        Write-Host "  cd $packageName"
                        Write-Host "  ./auto-deploy.sh"
                        Write-Host ""
                        ssh -t "${Username}@${ServerIP}" "cd $packageName && bash"
                    }
                    "3" {
                        Write-Info "Déploiement reporté."
                        Write-Host "Pour déployer plus tard:"
                        Write-Host "  ssh ${Username}@${ServerIP}"
                        Write-Host "  cd $packageName"
                        Write-Host "  ./auto-deploy.sh"
                    }
                    default {
                        Write-Warning "Choix invalide. Connexion SSH..."
                        ssh -t "${Username}@${ServerIP}" "cd $packageName && bash"
                    }
                }
            } else {
                Write-Error "✗ Erreur lors de la préparation sur le serveur"
            }
        } else {
            Write-Error "✗ Erreur lors du transfert SCP"
            Write-Warning "Transférez manuellement le fichier $archivePath"
        }
    } else {
        Write-Error "✗ Impossible de se connecter en SSH"
        Write-Warning "Vérifiez les paramètres de connexion et transférez manuellement"
        Write-Host "Fichier à transférer: $archivePath"
    }
} catch {
    Write-Error "✗ Erreur lors du transfert: $($_.Exception.Message)"
    Write-Warning "Transférez manuellement le fichier $archivePath vers le serveur"
}

# ÉTAPE 7: Nettoyage
Write-Info "[ÉTAPE 7] Nettoyage..."

# Supprimer le dossier temporaire
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

# Demander si on garde l'archive locale
$keepArchive = Read-Host "Conserver l'archive locale $archivePath ? (y/n) [n]"
if ($keepArchive -notmatch "^[Yy]") {
    Remove-Item $archivePath -Force -ErrorAction SilentlyContinue
    Write-Success "✓ Archive locale supprimée"
} else {
    Write-Info "Archive conservée: $archivePath"
}

# Résumé final
Write-Host ""
Write-Info "==============================================="
Write-Info "        PRÉPARATION TERMINÉE"
Write-Info "==============================================="
Write-Host ""
Write-Success "✓ Package créé et transféré"
Write-Success "✓ Scripts de déploiement prêts"
Write-Host ""
Write-Info "Accès final prévu:"
if ($SkipSSL) {
    Write-Host "  http://$Domain"
} else {
    Write-Host "  https://$Domain"
}
Write-Host ""
Write-Info "Pour vous reconnecter plus tard:"
Write-Host "  ssh ${Username}@${ServerIP}"
Write-Host "  cd $packageName"
Write-Host "  ./manage.sh status"
Write-Host ""