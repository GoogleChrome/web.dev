---
title: How to install the Thumbor image CDN
subhead: Thumbor can be used for free to resize, compress, and transform images on-demand.
authors:
  - katiehempenius
date: 2019-08-14
hero: image/admin/prjXX7rGf0hOFVZVoxUe.jpg
alt: A pile of photos.
description: |
  Instructions on how to install Thumbor. Thumbor is an open-source image CDN and can be used for free to resize, compress, and transform images.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - images
---

Image CDNs make it easy to dynamically optimize the aesthetics and performance of your images. Unlike most image CDNs, [Thumbor](http://thumbor.org/) is open-source and can be used for free to resize, compress, and transform images. It's suitable for production use; [Wikipedia](https://wikitech.wikimedia.org/wiki/Thumbor) and [Square](https://medium.com/square-corner-blog/dynamic-images-with-thumbor-a430a1cfcd87) both use Thumbor.

This guide explains how to install Thumbor on your own server. Once installed, you'll be able to use Thumbor as an API for transforming your images.

## Intro

You'll be installing Thumbor on a VM running Ubuntu 16.04. Ubuntu 16.04 is a very common image and these instructions are intended to work on any cloud provider. Creating a VM might sound like more work than installing Thumbor on your local machine, but the minutes that you take to create a VM will probably save you hours or days of frustration trying to get Thumbor to properly install on your local machine. Although easy to use, Thumbor is notoriously difficult to install but these instructions simplify the process. If dependencies download quickly, the installation can be completed in 5 to 10 minutes.

## Prerequisites

This post assumes that you know how to create a Ubuntu 16.04 LTS VM on a cloud platform like [Google Cloud](https://cloud.google.com/compute/docs/instances/create-start-instance), [AWS,](https://aws.amazon.com/getting-started/tutorials/launch-a-virtual-machine/) or [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal?toc=%2Fazure%2Fvirtual-machines%2Flinux%2Ftoc.json) and how to use command line tools to set up the VM.

## Install Thumbor Dependencies

Update and upgrade Ubuntu's already-installed packages:

```bash
sudo apt-get update -y && sudo apt-get upgrade -y
```

Install `pip`, the package manager for Python. Later you'll install Thumbor with `pip`.

```bash
sudo apt-get install -y python-pip
```

Install Thumbor's dependencies. Thumbor's documentation does not explicitly mention these dependencies, but Thumbor will not install successfully without them.

```bash
# ssl packages
sudo apt-get install -y libcurl4-openssl-dev libssl-dev
```

```bash
# computer vision packages
sudo apt-get install -y python-opencv libopencv-dev
```

```bash
# image format packages
sudo apt-get install -y libjpeg-dev libpng-dev libwebp-dev webp
```

## Install Thumbor

Install Thumbor using pip.

```bash
sudo pip install thumbor
```

Note: Many Python developers use [virtualenv](https://pypi.org/project/virtualenv/) to manage their packages. For the sake of simplicity, these instructions do not use `virtualenv`. If you are installing Thumbor in a standalone environment, `virtualenv` is not necessary. If you choose to use `virtualenv`, note that Thumbor requires Python 2.7 and will not work with newer versions of `pip` (e.g., these instructions use `pip` 8.1.1).

If you've successfully installed Thumbor, this should work:

```bash
thumbor --help
```

## Run Thumbor

Run Thumbor. Debug logging is optional but can be helpful when you're getting started.

```bash
thumbor --log-level debug
```

Thumbor is now running.

## Open Firewall Port

By default, Thumbor runs on port 8888. If your VM's IP address is `12.123.12.122`, then you would access Thumbor from the web browser at `http://12.123.12.123:8888/.../$IMAGE`.

However, this probably won't work for you (yet) because cloud providers usually require that you explicitly open firewall ports before they will accept incoming traffic.

Update the firewall to expose port 8888. Here's more information on how to do this for: [Google Cloud](https://cloud.google.com/vpc/docs/using-firewalls), [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html), and [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/nsg-quickstart-portal). Note that for Google Cloud you need to first [assign a static IP address to your VM](https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address) and then [allow an external HTTP connection](https://cloud.google.com/vpc/docs/special-configurations#externalhttpconnection).

## Try It Out

Thumbor is now accessible and ready for use. Try it out by visiting the following URL:

```text
http://YOUR_VIRTUAL_MACHINE:8888/unsafe/100x100/https://web.dev/install-thumbor/hero.jpg
```

Note that this URL uses HTTP. Thumbor uses HTTP by default but can be [configured](https://thumbor.readthedocs.io/en/latest/image_loader.html) to use HTTPS.

You should see an image that is 100 pixels wide by 100 pixels tall. Thumbor has taken the image `hero.jpg` and size specified in the URL string and served the result. You can replace the image in the URL string (i.e., `https://web.dev/install-thumbor/hero.jpg`) with any other image (e.g., `https://your-site.com/cat.jpg`) and Thumbor will resize that image too.

The [Optimize images with Thumbor](/use-thumbor/#thumbor-url-format) article has more information on using the Thumbor API. In particular, you may be interested in [setting up a Thumbor configuration file](/use-thumbor/#appendix:-thumbor.conf).

## Appendix: Configuring Systemd

This step explains how to make sure that the Thumbor process keeps running, even after the VM has been restarted. This step is important for production sites, but optional if you're just playing around with Thumbor.

[Systemd](https://www.freedesktop.org/software/systemd/man/systemd.html) is the "system and service manager" for Linux operating systems. `systemd` makes it easy to configure when services (processes) run.

You will be configuring `systemd` to automatically start Thumbor on VM boot. If the VM is restarted, the Thumbor process will automatically restart as well. This is much more reliable than relying on user intervention to start Thumbor.

Navigate to the `/lib/systemd/system` directory. This directory contains the service files for `systemd`.

```bash
cd /lib/systemd/system
```

As superuser, create a `thumbor.service` file.

```bash
sudo touch thumbor.service
```

Using your favorite text editor (vim and nano come pre-installed on Ubuntu or you can install another editor), add the following configuration to `thumbor.service`. This configuration will run `/usr/local/bin/thumbor` (i.e. the Thumbor binary) once networking is available and will restart Thumbor on [failure](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Restart=).

```text
[Unit]

Description=Service for Thumbor image CDN

Documentation=https://thumbor.readthedocs.io/en/latest/

After=network.target

[Service]

ExecStart=/usr/local/bin/thumbor

Restart=on-failure

[Install]

WantedBy=multi-user.target
```

`systemctl` is the utility used to manage `systemd`. Use the `start` command to start Thumbor.

```bash
sudo systemctl start thumbor.service
```

Note: If Thumbor is currently running, you should stop it before attempting to start Thumbor using `systemctl`.

Next, "enable" Thumbor. This means that Thumbor will automatically start on boot.

```bash
sudo systemctl enable thumbor.service
```

Verify that you've successfully configured `systemd` by running the `status` command.

```bash
systemctl status thumbor.service
```

If you've successfully set up thumbor.service to use `systemd`, the [status](https://www.freedesktop.org/software/systemd/man/systemctl.html#status%20PATTERN%E2%80%A6%7CPID%E2%80%A6%5D) should show that it is enabled and active.

<figure class="w-figure">
  {% Img src="image/admin/e04pxe6uE090ewJ3WWPX.jpg", alt="Systemctl displaying the status of Thumbor", width="466", height="164", class="w-screenshot" %}
</figure>
