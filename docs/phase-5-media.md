# Phase 5: Media messages without Firebase Storage

Implemented:

- Image, video, and document pickers
- A replaceable media provider abstraction
- Cloudinary unsigned-upload adapter using free-tier configuration
- Image previews in chat
- Video and document links that open with the device viewer
- Media metadata stored in Firestore messages
- No Firebase Storage usage

## Configure shared media

Copy `.env.example` to `.env` and set:

```text
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

Create an unsigned upload preset in Cloudinary. Do not place an API secret in the mobile app. Local device storage is used for temporary picker files; shared media requires a remote provider so recipients can access it.

The upload provider can later be replaced with Supabase Storage or another compatible provider without changing chat UI code.
