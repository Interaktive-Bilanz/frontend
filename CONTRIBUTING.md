# 🤝 Contributing

## Git Workflow

- **`main`** - Production (geschützt, nur via PR)
- **`development`** - Development Branch

```bash
# Setup
git clone https://github.com/Interaktive-Bilanz/frontend.git
cd frontend
npm install

# Workflow
git checkout development
git pull origin development
git checkout -b feature/new-component
# ... entwickeln ...
git add .
git commit -m "feature: new button component"
git push -u origin feature/new-component
# PR erstellen: feature/new-component → development (via PR)
# Nach Merge: development → main (via PR)
```

## Branch Naming

```
feature/component-name
fix/bug-description  
update/existing-feature
remove/old-code
refactor/code-cleanup
style/design-changes
docs/readme-update
```

## Commit Types

- `feature:` - Neue Features/Dateien
- `fix:` - Bugfixes
- `update:` - Bestehende Features ändern
- `remove:` - Code/Features entfernen
- `refactor:` - Code-Struktur verbessern
- `style:` - CSS/Design Änderungen
- `docs:` - Dokumentation

## Before PR

```bash
npm run build  # muss funktionieren
npm test       # falls Tests vorhanden
```

## Code Style

- Funktionale Komponenten
- TypeScript für neue Dateien
- TailwindCSS für Styling
- PascalCase für Komponenten, camelCase für Variablen

---

**Happy Coding! 🚀**