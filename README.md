# 🚀 React Native + Kotlin Integration App

A **React Native mobile app** built to demonstrate rapid learning, React Native fundamentals, mobile development best practices, and native Android integration using Kotlin.

---

## 📖 Preface

This project was developed as part of an assignment to evaluate:

* Quick adaptation to **React Native** with prior Kotlin experience.
* Building a functional mobile app with **networking, state management, navigation, and UI using native components**.
* Integration of **native Android modules in Kotlin** exposed to JavaScript.
* Emphasis on **debugging, performance optimization, and code readability**.

---

## ✨ Features

### 1. Login Screen

* Simple form for username and password.
* On successful login, stores a persistent token using **AsyncStorage**.
* Navigates to the main app screens after login.

### 2. Users List Screen

* Fetches users from the [DummyJSON Users API](https://dummyjson.com/docs/users).
* Displays users in a scrollable `FlatList` with profile images.
* Includes **loading** and **error states**.

### 3. User Detail Screen

* Displays selected user details:

  * Name, email, phone
  * Address & company information
* Provides back navigation to the list.

### 4. Native Kotlin Integration: BatteryModule

#### Kotlin Module Code

**BatteryModule.kt**

```kotlin
package com.assignment

import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.*

class BatteryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BatteryModule"

    @ReactMethod
    fun getBatteryLevel(promise: Promise) {
        try {
            val intentFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            val batteryStatus = reactApplicationContext.registerReceiver(null, intentFilter)

            val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1

            val batteryPct = if (level >= 0 && scale > 0) (level * 100) / scale else -1

            promise.resolve(batteryPct)
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", e)
        }
    }
}
```

**BatteryPackage.kt**

```kotlin
package com.assignment

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BatteryPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
        listOf(BatteryModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
        emptyList()
}
```

**Integration in MainApplication.kt**

```kotlin
// Inside getPackages() override in MainApplication
add(BatteryPackage()) // Manually adds BatteryModule to React Native
```

#### React Native Usage

```javascript
import { useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
const { BatteryModule } = NativeModules;

const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

useEffect(() => {
    const getBattery = async () => {
        try {
            const level = await BatteryModule.getBatteryLevel();
            setBatteryLevel(level);
        } catch (e) {
            console.log("Battery fetch error:", e);
        }
    };

    getBattery();
    const interval = setInterval(getBattery, 30000);
    return () => clearInterval(interval);
}, []);
```

**Output Example**

```
Battery Level: 87%
```

*Updates every 30 seconds automatically.*

---

### 5. UI & Debugging

* Uses **native React Native components** with custom styling, no third-party UI libraries.
* Debugging performed with **Flipper** and React Native Debugger.
* Example bug solved: *AsyncStorage token retrieval intermittently failing*.
  Solution: called async function in `useEffect` after component mount and verified using Flipper logs.

### 6. Performance Optimizations

* Optimized `FlatList` rendering using:

  * `keyExtractor`
  * Memoized list items with `React.memo`
* Used `useCallback` and `useMemo` to prevent unnecessary re-renders.

### 7. Cross-platform Notes

* Fully functional on **Android**.
* iOS support **not included** (testing environment limitation).

---

## 🖼 Screenshots

| Login                           | Users List                    | User Detail                       | Battery Module Output                     |
| ------------------------------- | ----------------------------- | --------------------------------- | ----------------------------------------- |
| ![Login](screenshots/login.png) | ![List](screenshots/list.png) | ![Detail](screenshots/detail.png) | ![Battery](screenshots/native_module.png) |

---

## ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/Surajpurohitcode/react-native-kotlin-integration-app.git
cd react-native-kotlin-integration-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start Metro bundler**

```bash
npx react-native start
```

4. **Run the Android app**

```bash
npx react-native run-android
```

5. **Login credentials**

```
Username: admin@test.com
Password: test@456
```

6. *(Optional)* Install APK directly: [Download APK](link-to-apk)

---

## 💡 Challenges & Solutions

**Challenge:** Integrating Kotlin native module with React Native while ensuring asynchronous results are handled correctly.

**Solution:**

* Ensured Kotlin functions return Promises.
* Called native functions after component mount with `useEffect`.
* Verified output using Flipper logs to debug timing issues.

---

## 🔮 Future Improvements

* Integrate **MVVM architecture** for better state management.
* Add offline caching and persistent storage for the users list.
* Implement unit tests and UI testing for higher reliability.
* Explore **iOS support** and platform-specific optimizations.
* Modularize native modules for reusability.

---

## 📝 Learnings

* Rapidly learned and applied **React Native fundamentals** including navigation, FlatList, state management, and AsyncStorage.
* Gained hands-on experience with **native module integration using Kotlin**.
* Learned to optimize performance with **memoization and FlatList optimization**.
* Improved debugging skills using **Flipper and React Native Debugger**.
* Enhanced understanding of cross-platform development considerations.

---

## ⚠️ Known Issues / Limitations

* iOS not supported.
* Slight delay in battery updates on some Android devices.
* No offline caching implemented for users list.

---

## 📎 References

* [React Native Docs](https://reactnative.dev/docs/getting-started)
* [DummyJSON Users API](https://dummyjson.com/docs/users)
* [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/install/)

---

## 🎬 Demo

*(Optional: include GIF/video of app)*
[APK for Testing](link-to-apk)
