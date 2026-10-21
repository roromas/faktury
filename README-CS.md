# Fakturka pro Android — instalovatelná offline aplikace

Toto je Android Studio projekt vytvořený z dodaného `Fakturka.html`. Rozhraní a hlavní fakturační logika zůstávají zachované; doplněno je lokální ukládání, export/obnova zálohy JSON a ukládání PDF do složky Stažené soubory.

## Co funguje offline
- formulář, nastavení dodavatele, položky faktury a přehled faktur;
- místní ukládání v úložišti WebView na tomto telefonu;
- generování PDF a QR platby po instalaci;
- export zálohy `Fakturka-zaloha-YYYY-MM-DD.json` do Stažených souborů;
- obnova zálohy přes výběr JSON souboru.

Knihovny pro PDF a QR se stáhnou pouze během sestavení APK. Nainstalovaná aplikace už pro provoz internet nepotřebuje. Google Fonts byly odstraněny; aplikace používá systémové náhradní fonty, aby vzhled nebyl závislý na internetu.

## Jak vytvořit APK
1. Nainstalujte Android Studio na počítač a při prvním spuštění doinstalujte Android SDK Platform 35 a Android SDK Build-Tools.
2. Rozbalte ZIP a v Android Studiu zvolte **Open** a vyberte složku `Fakturka-Android`.
3. Počkejte na Gradle Sync. První sestavení potřebuje internet pro stažení Android/Gradle závislostí a tří JS knihoven (PDFMake, fonty PDFMake a QR generator).
4. V menu zvolte **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. APK najdete v `app/build/outputs/apk/debug/app-debug.apk`. Přeneste ho do telefonu a otevřete; Android může požádat o povolení instalace aplikací z daného zdroje.
6. Při další instalaci nebo aktualizaci používejte stejný podpisový klíč, jinak Android může vyžadovat odinstalaci starší verze. Odinstalace může smazat místní data — nejdřív udělejte zálohu.

## Zálohování
V aplikaci otevřete **Nastavení → Záloha dat → Exportovat zálohu**. Soubor uložte mimo telefon. Pro obnovu zvolte **Obnovit ze zálohy** a vyberte JSON soubor. Obnova přepíše aktuální data aplikace.

## Důležité poznámky
- Data jsou pouze v tomto telefonu; mezi telefony se automaticky nesynchronizují.
- Zálohu dělejte pravidelně a před aktualizací aplikace.
- Zdroj HTML původně podporoval i úložiště prostředí Claude; v Android verzi se používá lokální úložiště.
- Zde přiložený projekt je zdroj pro sestavení APK, nikoli již podepsané instalační APK. V tomto prostředí není Android SDK/Gradle nainstalováno, takže samotné APK zde nebylo možné sestavit a otestovat.


## Jednodušší sestavení přes GitHub (bez počítače s Android Studiem)

1. Na GitHubu vytvoř nové úložiště (repository), například `fakturka-android`. Doporučení: nastav ho jako **Private**, protože fakturační aplikace může obsahovat obchodní logiku a osobní údaje v testovacích datech.
2. Nahraj do úložiště všechny soubory a složky z tohoto ZIPu. Důležitá je i skrytá složka `.github/workflows/build-android.yml`.
3. Otevři kartu **Actions**. Pokud GitHub vyžádá povolení workflow, potvrď ho.
4. Workflow se spustí po nahrání na větev `main`/`master`. Můžeš ho spustit i ručně přes **Actions → Build Fakturka APK → Run workflow**.
5. Po dokončení otevři běh workflow, sjeď dolů na **Artifacts** a stáhni `Fakturka-Android-APK`.
6. Rozbal stažený ZIP v telefonu a klepni na `app-debug.apk`. Pokud Android instalaci zablokuje, povol pro použitou aplikaci (např. Chrome nebo Správce souborů) možnost **Instalovat neznámé aplikace** a instalaci zopakuj.

GitHub Actions sestavuje APK v cloudu. První běh potřebuje internet; nainstalovaná aplikace je navržena pro offline provoz. Workflow ukládá APK jako artefakt na 14 dní. Jde o testovací/debug APK, ne o APK podepsané pro distribuci v Google Play.
