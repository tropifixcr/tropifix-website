# Phone test checklist

Ten minutes, on your own phone, before each launch and after any big change. Use a deploy preview or the live address.

1. **Load on mobile data.** Turn Wi-Fi off and open the home page. The headline and form should appear within about 3 seconds.
2. **Hero.** The video plays silently and smoothly, or the still image shows. No play button, no sound. (Until the hero image is generated, the hero is a plain teal field.)
3. **Sticky button.** Scroll past the form: the "Request a fix" bar slides in at the bottom. Scroll back to the form: it slides away. It never covers a form field.
4. **Form, step by step.** Add `?test=1` to the address first.
   - Step 1: pick a service, type a description, tap "Add photos" and **take a photo with the camera**. A thumbnail appears.
   - Step 2: pick Tamarindo – Las Catalinas and check the list of beaches appears. Pick another zone and check a text field replaces it.
   - Steps 3 and 4: tap Next with nothing filled once, to see the error messages.
   - Go Back two steps and forward again: your answers are still there.
5. **Submit.** Use the name "TEST". You should see "Thanks, TEST. We've got your request."
6. **Email.** The lead arrives in the leads inbox with a subject starting `[TEST]` and the photo.
7. **WhatsApp.** Tap "Continue on WhatsApp": WhatsApp opens with the summary filled in. Don't send it.
8. **Spanish.** Tap "ES" in the header: the same page opens in Spanish. Tap "EN" to come back.
9. **Links.** Tap each header and footer link, one service tile, and a related service on that page.
10. **Rotate** the phone to landscape on the form: nothing overlaps or scrolls sideways.

## iPhone (Safari) and Android (Chrome) differences

- **Photos:** on iPhone, "Add photos" offers Photo Library, Take Photo and Choose File. On Android it offers Camera and Files. Both are correct.
- **Photo format:** Android sends WebP. iPhone sends JPEG, because Safari cannot create WebP. Both are compressed.
- **Keyboard:** the WhatsApp field should open the number pad, and the email field should show `@` on the main keyboard.
- **Zoom:** on iPhone, tapping a field must not zoom the page in. If it does, a font is below 16px: report it.
- **Bottom bar:** on iPhones with no home button, the sticky bar sits above the home indicator, not under it.
- **Low Power Mode (iPhone):** videos may not autoplay; the still image showing is the expected result.
