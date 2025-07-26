# 🤝 Contributing Guidelines

## 📋 Workflow Overview

Wir verwenden einen **Git Flow** mit `main` und `development` Branches:

- **`main`** - Production-ready Code (geschützt)
- **`development`** - Development Branch für neue Features

## 🚀 Wie du beitragen kannst

### 1. Repository Setup
```bash
# Repository klonen
git clone https://github.com/Interaktive-Bilanz/frontend.git
cd frontend

# Dependencies installieren
npm install

# Development Server starten
npm start
```

### 2. Feature Development

#### Schritt 1: Auf Development Branch wechseln
```bash
git checkout development
git pull origin development
```

#### Schritt 2: Feature Branch erstellen
```bash
# Branch-Naming Convention:
# feature/kurze-beschreibung
# bugfix/issue-nummer
# hotfix/kritischer-fix

git checkout -b feature/neue-komponente
```

#### Schritt 3: Entwickeln & Committen
```bash
# Änderungen staged
git add .

# Commit mit aussagekräftiger Nachricht
git commit -m "Add: Neue Button-Komponente mit Tailwind styling

- Erstellt wiederverwendbare Button-Komponente
- Integriert TailwindCSS für Styling
- Hinzugefügt TypeScript Props Interface"
```

#### Schritt 4: Branch pushen
```bash
git push -u origin feature/neue-komponente
```

### 3. Pull Request erstellen

1. **Gehe zu GitHub** und erstelle einen Pull Request
2. **Base Branch:** `development` (nicht `main`!)
3. **Fülle das PR Template aus** (wird automatisch geladen)
4. **Weise Reviewer zu**

### 4. Code Review Process

- ✅ Mindestens 1 Approval erforderlich
- ✅ Alle Tests müssen grün sein
- ✅ Code folgt den Projektstandards
- ✅ TypeScript ohne Fehler

### 5. Merge & Cleanup

Nach dem Merge wird der Feature-Branch **automatisch gelöscht**.

Lokale Branches aufräumen:
```bash
git checkout development
git pull origin development
git branch -d feature/neue-komponente
```

## 📝 Commit Message Convention

### Format:
```
Type: Kurze Beschreibung (max. 50 Zeichen)

Längere Beschreibung falls nötig:
- Was wurde geändert
- Warum wurde es geändert
- Besondere Hinweise für Reviewer
```

### Types:
- `Add:` - Neue Features/Dateien
- `Fix:` - Bugfixes
- `Update:` - Bestehende Features ändern
- `Remove:` - Code/Features entfernen
- `Refactor:` - Code-Struktur verbessern
- `Style:` - CSS/Design Änderungen
- `Docs:` - Dokumentation

### Beispiele:
```bash
git commit -m "Add: User authentication component"
git commit -m "Fix: Button hover state in dark mode"
git commit -m "Update: API endpoint for user profile"
```

## 🏷️ Branch Naming

```bash
# Features
feature/user-login
feature/dashboard-widgets
feature/responsive-design

# Bugfixes
bugfix/header-mobile-menu
bugfix/api-error-handling

# Hotfixes (kritische Production-Fixes)
hotfix/security-vulnerability
hotfix/payment-gateway-fix
```

## 🧪 Before Pull Request

### Lokale Tests:
```bash
# App builden (muss ohne Fehler laufen)
npm run build

# Tests ausführen
npm test

# TypeScript prüfen
npx tsc --noEmit

# Linting (falls konfiguriert)
npm run lint
```

### Checklist:
- [ ] Code funktioniert lokal
- [ ] Keine TypeScript Fehler
- [ ] Build läuft erfolgreich
- [ ] Neue Features sind getestet
- [ ] Code ist dokumentiert
- [ ] Keine console.log() vergessen

## 🚨 Production Releases

**Nur Maintainer können auf `main` mergen!**

```bash
# Release Process (nur für Maintainer):
1. Development ist stabil und getestet
2. Pull Request: development → main
3. Code Review
4. Merge nach main
5. GitHub Release erstellen
6. Deployment triggern
```

## 💡 Tipps

### Gute Practices:
- **Kleine, fokussierte Commits** statt große Änderungen
- **Aussagekräftige Commit Messages**
- **Regelmäßig rebasing** mit development
- **Tests schreiben** für neue Features
- **TypeScript Types** korrekt definieren

### Code Style:
- **Funktionale Komponenten** bevorzugen
- **TypeScript** für alle neuen Dateien
- **TailwindCSS** für Styling
- **Consistent naming** (camelCase für Variablen, PascalCase für Komponenten)

## 🆘 Hilfe

Bei Fragen oder Problemen:
1. **Schau in die Dokumentation**
2. **Erstelle ein GitHub Issue**
3. **Frag im Team Chat**

---

**Happy Coding! 🚀**