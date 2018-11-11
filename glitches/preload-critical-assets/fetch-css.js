// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0

var link = document.createElement( "link" );
link.href = "main.css";
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";

document.getElementsByTagName( "head" )[0].appendChild( link );