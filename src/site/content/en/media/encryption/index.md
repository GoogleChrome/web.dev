---
layout: post
title: Encryption
description: |
  If you plan to enforce copyright on your media, you'll want to encrypt them.
date: 2017-06-30
updated: 2020-06-10
---

If you plan to enforce copyright on your media, you'll want to encrypt them. I'm
going to introduce two encryption methods. The first is
[Widevine](https://www.widevine.com/wv_drm.html), a proprietary encryption
method offered by Google. The second, also free, is the
[Clear Key encryption system](https://www.w3.org/TR/encrypted-media/#clear-key)
, which is supported by a W3C spec.

### Clear Key Encryption

[Clear Key](https://www.w3.org/TR/encrypted-media/#clear-key)
is a common key system defined in the Encrypted Media Extensions specification
that uses unencrypted keys to decrypt
[MPEG Common Encryption (CENC)](https://en.wikipedia.org/wiki/MPEG_Common_Encryption)
content.

In practice this is a simple way to encrypt and decrypt content for playback on
the web. What's more, playback can be done with either DASH or HLS.  This
section will show you how to encrypt using Clear Key.

The first thing you need to do is generate a key. You can use whatever method
you want, but I'm going to use [OpenSSL](https://www.openssl.org/) to write
sixteen random hex digits to a file. This step is necessary when preparing
resources for both HLS and DASH.

```bash
openssl rand -out media.key 16
```

Note: Some versions of OpenSSL seem to create a file with white space and new
line characters. Make sure these are absent or removed from `media.key` before
proceeding.

Use Shaka Packager to do the actual encryption. Use the content of the
`media.key` file for both the `-key` and `-key-id` flags.

Note: For Clear Key, the key ID is supposed to be either the first 8 OR the
first 16 hex digits of the key. Since packager requires the key to be 16
digits and does not allow a 32 digit key, both flags are the same length.

```bash
packager \
  input=glocken.mp4,stream=audio,output=glocken_audio_encrypted.m4a \
  input=glocken.mp4,stream=video,output=glocken_video_encrypted.mp4 \
  --enable_fixed_key_encryption --enable_fixed_key_decryption \
  -key INSERT_KEY_HERE -key_id INSERT_KEY_HERE
```

### Widevine Encryption

Unless your company completes the Master License Agreement with
[Widevine](http://www.widevine.com/contact.html), this type of encryption
can really only be used for testing. Since this is covered without much
explanation on the Shaka Packager README here it goes.

Everything in this command except the name of your files and the `--content_id`
flag should be copied exactly from the example. The `--content_id` is 16 or 32
random hex digits. Use the keys provided here instead of your own. (This is how
Widevine works.)

```bash
packager \
  input=glocken.mp4,stream=audio,output=glocken_audio_encrypted.m4a \
  input=glocken.mp4,stream=video,output=glocken_video_encrypted.mp4 \
  --enable_widevine_encryption \
  --key_server_url "https://license.uat.widevine.com/cenc/getcontentkey/widevine_test" \
  --content_id "16_Rand_Hex_Chrs" --signer "widevine_test" \
  --aes_signing_key "1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9" \
  --aes_signing_iv "d58ce954203b7c9a9a9d467f59839249"
