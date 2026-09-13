# Web Ambient Sound & UI Audio

When adding ambient soundscapes or UI sound effects (like page turns, clicks, or chimes) to a web application—especially for a premium, Awwwards-style experience—**do not use the Web Audio API for synthetic sound generation.** Synthesized Web Audio API sounds can often sound metallic, harsh, and unpleasant if not perfectly mixed.

Instead, adhere to the following best practices:

1. **Use `howler.js`**: It is the industry standard for high-fidelity audio handling in the browser. It handles cross-fading, spatial audio, and legacy browser support out of the box.
2. **Use Real Audio Assets**: Point the `Howl` instances to real, high-quality audio files (e.g., `.mp3` or `.ogg` recordings of rain, fireplaces, real paper rustling).
3. **Multi-Track Mixing**: Build a multi-track ambient mixer (like ambient-mixer.com) by layering 2-4 subtle ambient loops.
4. **Graceful Failures**: If the audio files do not exist (e.g. 404), `howler.js` handles it gracefully. Set up the engine to expect these files in `public/sounds/` and instruct the user to source and place their own high-quality assets there.
