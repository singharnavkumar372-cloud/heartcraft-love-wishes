# 💖 HeartCraft - Personalized Love Proposal & Wishes Web App

**HeartCraft** is a modern, ultra-luxurious, and interactive romantic web application designed for creating personalized GF/Wife proposals, interactive love letters, birthday surprises, anniversary cards, and custom memory moments.

Built with **Zero-Backend Instant URL Sharing**, every created surprise is encoded directly into a shareable link that recipients can open on any mobile device or browser to experience a tailored, animated presentation!

---

## ✨ Features

- 💍 **Marriage Proposal ("Will You Marry Me?")**: Interactive virtual ring box opening animation with diamond ring sparkle & fireworks.
- 💖 **Relationship Proposal ("Will You Be My Girlfriend?")**: Playful escaping "No" button that teleports away when hovered or tapped.
- 💌 **Love Letter Studio**: Typewriter effect with wax-sealed envelope unsealing experience.
- 🎂 **Interactive Birthday Surprise**: Custom birthday song soundscapes & interactive cake where recipients can blow out candles.
- 🥂 **Anniversary & Special Wish Card**: Milestone counter, custom romantic notes & memories.
- 🧩 **100 Reasons Why I Love You**: Interactive card flipper deck.
- 🎨 **4 Stunning Themes**: *Rose Gold Glow*, *Midnight Starlight*, *Sunset Romance*, and *Neon Dream*.
- 🎵 **Ambient Soundscapes**: Web Audio API synthesized romantic background melodies.
- 📱 **Instant Sharing**: 1-click Copy Link, WhatsApp Direct Message formatting, and auto-generated QR Code for phone scanning.

---

## 🚀 How to Run Locally

Simply serve `index.html` using any local HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node serve
npx serve .
```

Then open `http://localhost:8000` in your web browser.

---

## 🌐 Zero-Backend Link Architecture

All user customizations are encoded into URL hashes using URL-safe Base64 signatures (`#card=...`). When a recipient opens the link:
1. The app automatically detects the payload.
2. Switches to **Recipient Presentation View**.
3. Renders the custom names, message, theme, and interactive elements instantly!

---

Developed with ❤️ by [singharnavkumar272-cloud](https.github.com/singharnavkumar272-cloud)
