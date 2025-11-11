> Edited for use in IDX on 07/09/12

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

#### Android

Android previews are defined as a `workspace.onStart` hook and started as a vscode task when the workspace is opened/started.

Note, if you can't find the task, either:
- Rebuild the environment (using command palette: `IDX: Rebuild Environment`), or
- Run `npm run android -- --tunnel` command manually run android and see the output in your terminal. The device should pick up this new command and switch to start displaying the output from it.

In the output of this command/task, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You'll also find options to open the app's developer menu, reload the app, and more.

#### Web

Web previews will be started and managred automatically. Use the toolbar to manually refresh.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Providing feedback

Due to the complexity of natural language processing, the translations provided might not be appropriate for all contexts or audiences. If you encounter inappropriate translations, reach out to [Firebase support](/support). Your feedback helps to continue to improve the models, and also allows us to disable inappropriate translations.

## Hot Bomb setup (Lottie + sound)

- Bomb animation: Replace `assets/animations/bomb.json` with your preferred Lottie JSON (bomb with a burning fuse). The app maps the game timer to the animation progress (0 → 1).
- Optional sounds: To enable fuse/explosion audio, set `FUSE_SOUND_URL` and `EXPLOSION_SOUND_URL` in `app/hot-bomb-game.tsx` to valid remote URLs. Alternatively, add local files and switch to `require()` if you prefer bundling them.

Steps to use local files:

1) Add files under `assets/sounds/`, e.g. `fuse.mp3` and `explosion.mp3`.
2) Replace the URL-based `Audio.Sound.createAsync({ uri: ... })` calls with:

```ts
// Example local usage
const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/fuse.mp3'), { shouldPlay: true, isLooping: true, volume: 0.6 });
```

Notes
- Lottie is integrated with progress, so the fuse burn aligns with the countdown.
- Audio is optional and guarded; if URLs are not set, the app runs without sound.
