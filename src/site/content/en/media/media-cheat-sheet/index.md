---
layout: post
title: Media manipulation cheat sheet
authors:
  - joemedley
description: |
  An ordered rundown of commands needed to get from a raw mov file to encrypted
  assets packaged for DASH or HLS.
date: 2018-09-20
updated: 2020-09-24
tags:
  - media
  - video
  - audio
---

This page offers these resources:

* Commands for manipulating specific characteristics of media files.
* The sequence of commands needed to get from a raw mov file to encrypted media assets.

Conversion is done with these applications:

* [Shaka Packager](https://github.com/google/shaka-packager) ([on Stack Overflow](https://stackoverflow.com/questions/tagged/shaka))
* [FFmpeg](https://ffmpeg.org/download.html), version 4.2.2-tessus ([on Stack Overflow](https://stackoverflow.com/questions/tagged/ffmpeg))
* [OpenSSL](https://www.openssl.org/)  ([on Stack Overflow](https://stackoverflow.com/questions/tagged/openssl))


Although I've tried to show equivalent operations for all procedures, not all
operations are possible in both applications.

In many cases, the commands I'm showing may be combined in a single command line
operation, and in actual use would be. For example, there's nothing preventing
you from setting an output file's bitrate in the same operation as a file
conversion. For this cheat sheet, I often show these operations as separate
commands for the sake of clarity.

Please let me know of useful additions or corrections.
[Pull requests are welcome](/media-cheat-sheet).

{% Aside %}
This page contains a few more commands than are covered in this section. Not
only are there plans to cover these topics (we have drafts already), we also
hope this page will be a resource for multiple levels of expertise.
{% endAside %}

## Display characteristics

```bash
packager input=myvideo.mp4 --dump_stream_info

ffmpeg -i myvideo.mp4
```

Technically, FFmpeg always requires an output file format. Calling FFmpeg this
way will give you an error message explaining that; however, it lists
information not available using Shaka Packager.

## Demux (split) audio and video

Shaka Packager requires demuxing when converting files. This is also required
for using media frameworks.

### Shaka Packager

***MP4***

```bash
packager input=myvideo.mp4,stream=video,output=myvideo_video.mp4
packager input=myvideo.mp4,stream=audio,output=myvideo_audio.m4a
```

Or:

```bash
packager \
  input=myvideo.mp4,stream=video,output=myvideo_video.mp4 \
  input=myvideo.mp4,stream=audio,output=myvideo_audio.m4a
```

***WebM***

```bash
packager \
  input=myvideo.webm,stream=video,output=myvideo_video.webm \
  input=myvideo.webm,stream=audio,output=myvideo_audio.webm
```
### FFmpeg

***MP4***

```bash
ffmpeg -i myvideo.mp4 -vcodec copy -an myvideo_video.mp4
ffmpeg -i myvideo.mp4 -acodec copy -vn myvideo_audio.m4a
```

***WebM***

```bash
ffmpeg -i myvideo.webm -vcodec copy -an myvideo_video.webm
ffmpeg -i myvideo.webm -acodec copy -vn myvideo_audio.webm
```

## Change characteristics

### Bitrate

For FFmpeg, I can do this while I'm converting to mp4 or WebM.

```bash
ffmpeg -i myvideo.mov -b:v 350K myvideo.mp4
ffmpeg -i myvideo.mov -vf setsar=1:1 -b:v 350K myvideo.webm
```

### Dimensions (resolution)

```bash
ffmpeg -i myvideo.webm -s 1920x1080 myvideo_1920x1080.webm
```

### File type

Shaka Packager cannot process mov files and hence cannot be used to convert
files from that format.

***mov to MP4***

```bash
ffmpeg -i myvideo.mov myvideo.mp4
```

***mov to WebM***

```bash
ffmpeg -i myvideo.mov myvideo.webm
```

### Synchronize audio and video

To ensure that audio and video synchronize during playback, insert keyframes.

```bash
ffmpeg -i myvideo.mp4 -keyint_min 150 -g 150 -f webm -vf setsar=1:1 out.webm
```


### Codec

The tables below list common containers and codecs for both audio and video, as
well as the FFmpeg library needed for conversion. A conversion library must be
specified when converting files using FFmpeg.

#### Video

| Codec | Container | Library    |
| ----- | --------- | ---------- |
| av1   | mkv       | libaom-av1 |
|       | WebM      | libaom-av1 |
| h264  | MP4       | libx264    |
| vp9   | WebM      | libvpx-vp9 |

#### Audio

| Codec  | Container | Library    |
| ------ | --------- | ---------- |
| aac    | MP4       | aac        |
| opus   | WebM      | libopus    |
| vorbis | WebM      | libvorbis  |

***MP4/H.264***

```bash
ffmpeg -i myvideo.mp4 -c:v libx264 -c:a copy myvideo.mp4
```

***Audio for an MP4***

```bash
ffmpeg -i myvideo.mp4 -c:v copy -c:a aac myvideo.mp4
```

***WebM/VP9***

```bash
ffmpeg -i myvideo.webm -v:c libvpx-vp9 -v:a copy myvideo.webm
```

***Audio for a WebM***

```bash
ffmpeg -i myvideo.webm -v:c copy -v:a libvorbis myvideo.webm
ffmpeg -i myvideo.webm -v:c copy -v:a libopus myvideo.webm
```

## Packager

### DASH/MPD

Dynamic Adaptive Streaming over HTTP is a
[web-standards-based](https://developer.mozilla.org/en-US/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video)
method of presenting video-on-demand for the web.

```bash
packager \
  input=myvideo.mp4,stream=audio,output=myvideo_audio.mp4 \
  input=myvideo.mp4,stream=video,output=myvideo_video.mp4 \
  --mpd_output myvideo_vod.mpd
```

### HLS

HTTP Live Streaming (HLS) is
[Apple's standard](https://developer.apple.com/streaming/)
for live streaming and video on demand for the web.

```bash
ffmpeg -i myvideo.mp4 -c:a copy -b:v 8M -c:v copy -f hls -hls_time 10 \
        -hls_list_size 0 myvideo.m3u8
```

## Clear Key Encryption

### Create a key

You can use the same method to create a key for both DASH and HLS. Do this using
[openssl](https://www.openssl.org/). The following will create a key made of 16
hex values.

```bash
openssl rand -out media.key 16
```

This command creates a file with white space and new line characters, which are
not allowed by Shaka Packager. You'll need to open the key file and manually
remove all whitespace including the final carriage return.

### Encrypt

For the `-key` flag use the key created earlier and stored in the media.key
file. However, when entering it on the command line, be sure you've removed its
whitespace. For the `-key_id` flag repeat the key value.

```bash
packager \
  input=myvideo.mp4,stream=audio,output=glocka.m4a \
  input=myvideo.mp4,stream=video,output=glockv.mp4 \
  --enable_fixed_key_encryption \
  -key INSERT_KEY_HERE -key_id INSERT_KEY_ID_HERE \
```

### Create a key information file

To encrypt for HLS you need a key information file in addition to a key file. A
key information file is a text file with the format below. It should have the extension `.keyinfo`. For example: `encrypt.keyinfo`.

```bash
key URI
key file path
private key
```

The key URI is where the `media.key` ([created above](#create-a-key) will be located on your server. The key file path is it's location relative to the key information file. Finally, the private key is the contents of the `media.key` file itself. For example:

```bash
https://example.com/media.key
/path/to/media.key
8b4c39c498949536
```

### Encrypt for HLS

```bash
packager \
  'input=input.mp4,stream=video,segment_template=output$Number$.ts,playlist_name=video_playlist.m3u8' \
  'input=input.mp4,stream=audio,segment_template=output_audio$Number$.ts,playlist_name=audio_playlist.m3u8,hls_group_id=audio,hls_name=ENGLISH' \
  --hls_master_playlist_output="master_playlist.m3u8" \
  --hls_base_url="http://localhost:1000/"
```

This command will accept a key with either 16 or 32 characters.


```bash
ffmpeg -i myvideo.mov -c:v libx264 -c:a aac -hls_key_info_file key_info myvideo.m3u8
```

## Widevine Encryption

```bash
packager \
  input=glocken.mp4,stream=video,output=enc_video.mp4 \
  input=glocken.mp4,stream=audio,output=enc_audio.m4a \
  --enable_widevine_encryption \
  --key_server_url "https://license.uat.widevine.com/cenc/getcontentkey/widevine_test" \
  --content_id "Hex_converted_unique_ID" --signer "widevine_test" \
  --aes_signing_key "1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9" \
  --aes_signing_iv "d58ce954203b7c9a9a9d467f59839249"
```

## Media conversion sequence

This section shows in order commands needed to get from a raw mov file to
encrypted assets packaged for DASH or HLS. For the sake of having a goal to
illustrate, I'm converting my source file to a bitrate of 8Mbs at a resolution
of 1080p (1920 x 1080). Adjust these values as your needs dictate.

### DASH/WebM with Shaka Packager

Not all steps are possible with Shaka Packager, so I'll use ffmpeg when I need to.

1. Convert the file type and codec.

    For this command you can use either `liborbis` or `libopus` for the audio codec.

    ```bash
    ffmpeg -i glocken.mov -c:v libvpx-vp9 -c:a libvorbis -b:v 8M -vf setsar=1:1 -f webm glocken.webm
    ```

2. Create a Clear Key encryption key.

    You'll need to open the key file and manually remove all whitespace
    including the final carriage return.

    ```bash
    openssl rand -out media.key 16
    ```

3. Demux (separate) the audio and video, encrypt the new files, and output a
   media presentation description (MPD) file.

    The `-key` and `-key_id` flags are copied from the `media.key` file.

    ```bash
    packager \
      input=myvideo.webm,stream=video,output=myvideo_video.webm \
      input=myvideo.webm,stream=audio,output=myvideo_audio.webm \
      --enable_fixed_key_encryption --enable_fixed_key_decryption \
      -key INSERT_KEY_HERE -key_id INSERT_KEY_ID_HERE \
      --mpd_output myvideo_vod.mpd
    ```

4. Remux (recombine) the audio and video streams. If you're using a video
   framework, you may not need to do this.

   ```bash
   ffmpeg -i mymovie.mp4 -i myaudio.m4a -c copy finalmovie.mp4
   ```

### DASH/MP4 with Shaka Packager

Not all steps are possible with Shaka Packager, so I'll use ffmpeg when I need to.

1. Convert the file type, video codec and bitrate.

    The default pixel format, yuv420p is used because one isn't supplied in the
    command line. The app will give you an error message that it is deprecated.
    I've chosen not to override the default because, though deprecated yuv420p
    is the most widely supported.

    ```bash
    ffmpeg -i mymovie.mov -c:v libx264 -c:a aac -b:v 8M -strict -2 mymovie.mp4
    ```

2. Create a Clear Key encryption key.

    You'll need to open the key file and manually remove all whitespace
    including the final carriage return.

    ```bash
    openssl rand -out media.key 16
    ```

3. Demux (separate) the audio and video, encrypt the new files, and output a
   media presentation description (MPD) file.

    The `-key` and `-key_id` flags are copied from the `media.key` file.

    ```bash
    packager \
      input=mymovie.mp4,stream=audio,output=myaudio.m4a \
      input=mymovie.mp4,stream=video,output=myvideo.mp4 \
      --enable_fixed_key_encryption --enable_fixed_key_decryption \
      -key INSERT_KEY_HERE -key_id INSERT_KEY_ID_HERE \
      --mpd_output myvideo_vod.mpd
    ```

4. Remux (recombine) the audio and video streams. If you're using a video
   framework, you may not need to do this.

   ```bash
   ffmpeg -i mymovie.mp4 -i myaudio.m4a -c copy finalmovie.mp4
   ```

### Widevine

The two previous examples used Clear Key encryption. For widevine the final two
steps are replaced with this.

Everything in this command except the name of your files and the `--content-id`
flag should be copied exactly from the example. The `--content-id` is 16 or 32
random hex digits. Use the keys provided here instead of your own.  (This is how
Widevine works.)

1. Demux (separate) the audio and video, encrypt the new files, and output a
   media presentation description (MPD) file.

    ```bash
    packager \
      input=mymovie.mp4,stream=audio,output=myaudio.m4a \
      input=mymovie.mp4,stream=video,output=myvideo.mp4 \
      --enable_widevine_encryption \
      --key_server_url "https://license.uat.widevine.com/cenc/getcontentkey/widevine_test" \
      --content_id "fd385d9f9a14bb09" --signer "widevine_test" \
      --aes_signing_key "1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9" \
      --aes_signing_iv "d58ce954203b7c9a9a9d467f59839249"
    ```

2. Remux (recombine) the audio and video streams. If you're using a video
   framework, you may not need to do this.

   ```bash
   ffmpeg -i mymovie.mp4 -i myaudio.m4a -c copy finalmovie.mp4
   ```

### HLS/MP4

HLS only supports MP4, so first you'll need to convert to the MP4 container and
supported codecs. Not all steps are possible with Shaka Packager, so I'll use
FFmpeg when I need to.

1. Convert the file type, video codec, and bitrate.

    The default pixel format, yuv420p, is used because one isn't supplied in the
    command line. The app will give you an error message that it is deprecated.
    I've chosen not to override the default because, though deprecated yuv420p
    is the most widely supported.

    ```bash
    ffmpeg -i mymovie.mov -c:v libx264 -c:a aac -b:v 8M -strict -2 mymovie.mp4
    ```

2. Create a Clear Key encryption key.

    You'll need to open the key file and manually remove all whitespace
    including the final carriage return.

    ```bash
    openssl rand -out media.key 16
    ```

3. Create a key information file

    ```bash
    packager \
      'input=input.mp4,stream=video,segment_template=output$Number$.ts, \
        playlist_name=video_playlist.m3u8' \
          'input=input.mp4,stream=audio,segment_template=output_audio$Number$.ts, \
        playlist_name=audio_playlist.m3u8,hls_group_id=audio,hls_name=ENGLISH' \
          --hls_master_playlist_output="master_playlist.m3u8" \
          --hls_base_url="http://localhost:1000/" \
          --enable_fixed_key_encryption --enable_fixed_key_decryption \
          -key INSERT_KEY_HERE -key_id INSERT_KEY_ID_HERE \
    ```
