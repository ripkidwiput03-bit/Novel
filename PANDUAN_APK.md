# 📱 PANDUAN: Cara Jadikan APK Android
## "Kabut di Pelabuhan Lama" — Novel Reader

---

## FILE YANG SUDAH DIBUAT

```
📁 Folder Novel kamu/
├── index.html          ← file utamamu (tambahkan patch)
├── offline.html        ← ✅ BARU: halaman offline detector
├── manifest.json       ← ✅ BARU: PWA manifest untuk install
├── sw.js               ← ✅ BARU: Service Worker (offline cache)
├── pwa-patch.html      ← ✅ BARU: kode yang perlu ditempel ke index.html
├── css/style.css
├── js/app.js
├── chapters/
└── images/
```

---

## LANGKAH 1: Integrasi File Baru ke index.html

### A. Tambahkan ke dalam `<head>`:
Buka `pwa-patch.html`, copy bagian yang ada komentar `<!-- === TEMPEL INI DI DALAM <head> === -->`,
tempel sebelum `</head>` di `index.html`.

### B. Tambahkan sebelum `</body>`:
Copy bagian yang ada komentar `<!-- === TEMPEL INI SEBELUM </body> === -->`,
tempel setelah `<script src="js/app.js"></script>`.

---

## LANGKAH 2: Pilih Cara Buat APK

### 🥇 CARA 1 — TWA (Trusted Web Activity) via Bubblewrap [TERBAIK]
Paling native, APK asli Android, tersedia di Google Play.

**Prasyarat:** Node.js, Java JDK, Android Studio

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Init project
bubblewrap init --manifest https://DOMAIN-KAMU.com/manifest.json

# Build APK
bubblewrap build
```

Output: `app-release-signed.apk` ✅

---

### 🥈 CARA 2 — PWABuilder (paling mudah, tidak perlu coding)

1. Pergi ke **https://www.pwabuilder.com**
2. Masukkan URL website novelmu (harus sudah di-host)
3. Klik **"Package for Stores"**
4. Pilih **Android** → Download APK atau AAB
5. Install APK ke HP secara langsung

**Catatan:** Butuh domain yang sudah di-host (bisa pakai GitHub Pages gratis)

---

### 🥉 CARA 3 — WebView Android Studio [Untuk offline total / local file]

Jika novelmu **tidak perlu server** (semua file ada di HP):

#### a. Buat project Android baru di Android Studio
- New Project → Empty Activity

#### b. Tambahkan WebView ke `activity_main.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
        
</LinearLayout>
```

#### c. Edit `MainActivity.kt`:
```kotlin
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true          // ← Penting untuk localStorage
            allowFileAccess = true
            allowContentAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            loadsImagesAutomatically = true
            mediaPlaybackRequiresUserGesture = false
            setSupportZoom(false)
        }
        
        webView.webViewClient = WebViewClient()
        
        // Load novel dari assets
        webView.loadUrl("file:///android_asset/novel/index.html")
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

#### d. Copy semua file novel ke `app/src/main/assets/novel/`

```
app/src/main/assets/novel/
├── index.html
├── offline.html
├── manifest.json
├── css/style.css
├── js/app.js
├── chapters/
└── images/
```

#### e. Tambahkan permission di `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

<application
    android:usesCleartextTraffic="true"
    ...>
    
    <activity
        android:name=".MainActivity"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN"/>
            <category android:name="android.intent.category.LAUNCHER"/>
        </intent-filter>
    </activity>
</application>
```

#### f. Build APK:
```
Build → Generate Signed Bundle/APK → APK → Create key → Build
```

---

### ⚡ CARA 4 — Capacitor (Ionic) [Untuk developer]

```bash
# Install Capacitor
npm install -g @ionic/cli

# Buat project
ionic start KabutNovel blank --type=angular

# Copy file novel ke www/ folder
# Tambahkan Capacitor Android
npx cap add android
npx cap copy android
npx cap open android
# → Build dari Android Studio
```

---

## LANGKAH 3: Deteksi Offline di Dalam Aplikasi

File `offline.html` yang sudah dibuat akan otomatis tampil ketika:

1. **PWA / TWA**: Service Worker intercept request → redirect ke `offline.html`
2. **WebView**: Bisa tambahkan deteksi manual:

```kotlin
// Tambahkan di MainActivity.kt
import android.net.ConnectivityManager
import android.net.NetworkCapabilities

fun isOnline(): Boolean {
    val cm = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
    val network = cm.activeNetwork ?: return false
    val caps = cm.getNetworkCapabilities(network) ?: return false
    return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
}

// Di onCreate(), setelah setup WebView:
if (!isOnline()) {
    webView.loadUrl("file:///android_asset/novel/offline.html")
} else {
    webView.loadUrl("file:///android_asset/novel/index.html")
}

// Register receiver untuk detect perubahan koneksi
val receiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (!isOnline()) {
            webView.loadUrl("file:///android_asset/novel/offline.html")
        }
    }
}
registerReceiver(receiver, IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION))
```

---

## LANGKAH 4: Host di GitHub Pages (untuk TWA/PWABuilder)

```bash
# 1. Buat repository di GitHub (mis: kabut-novel)

# 2. Upload semua file novel
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/kabut-novel.git
git push -u origin main

# 3. Aktifkan GitHub Pages
# → Repository Settings → Pages → Branch: main → / (root)
# URL: https://USERNAME.github.io/kabut-novel/
```

---

## CARA CEPAT: Install sebagai PWA (Android Chrome)

Bahkan tanpa APK, user bisa install langsung dari browser:

1. Buka URL novel di **Chrome Android**
2. Tap menu **⋮** (titik tiga) 
3. Tap **"Add to Home Screen"** atau **"Install App"**
4. Novel akan tampil seperti aplikasi native ✅

---

## CHECKLIST SEBELUM RELEASE APK

- [ ] `manifest.json` sudah diisi dengan benar (icons, name, start_url)
- [ ] `sw.js` sudah di-register di `index.html`
- [ ] `offline.html` tersedia di root folder
- [ ] Semua chapter sudah ter-cache (buka sekali saat online)
- [ ] Test di device nyata (bukan emulator saja)
- [ ] Tema dark/light berfungsi di WebView
- [ ] Back button Android berfungsi (goBack atau close)
- [ ] localStorage berfungsi (bookmark, progress, theme tersimpan)

---

## ICON APK

Untuk icon aplikasi yang bagus, gunakan `images/cover.jpg` dan:
- Buat versi 192x192 dan 512x512
- Simpan sebagai `images/icon-192.png` dan `images/icon-512.png`
- Update `manifest.json` untuk menunjuk ke file PNG

Tools gratis buat icon: **https://realfavicongenerator.net**

---

*Dibuat untuk: Kabut di Pelabuhan Lama — © 2026 Ripki Dwi Putra*
