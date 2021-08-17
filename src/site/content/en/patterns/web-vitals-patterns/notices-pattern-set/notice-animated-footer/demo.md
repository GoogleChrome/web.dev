---
patternId: notice-animated-footer
---
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Animated Footer Demo</title>
    <style>
        body {
            overscroll-behavior-y: none;
            font-family: system-ui;
            padding: 2em;
        }
        .banner {
            animation: slideIn 1000ms ease-in-out;
            position: fixed;
            left: 0;
            bottom: 0;
            right: 0;
            padding: 1rem;
            background-color: yellow;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
        }
        @keyframes slideIn {
            from {
                transform: translateY(100vh)
            }

            to {
                transform: translateY(0vh)
            }
        }
        .close-button {
            background: transparent;
            border: none;
            padding: 1em;
            font-size: 1em;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <div id="banner" class="banner">
        <button id="close-button" class="close-button" aria-label="close" tabindex="0">✕</button>
        <div>
            <h1>Notice</h1>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
        </div>
    </div>
    <script>
        document.getElementById("close-button").onclick = () => {
            document.getElementById("banner").style = "display: none";
        }
    </script>
    <div class="filler">
        <h1>Animated Footer</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
            Sit
            amet mattis vulputate enim nulla. Faucibus nisl tincidunt eget nullam non. Sem fringilla ut morbi tincidunt
            augue. Sed id semper risus in hendrerit gravida rutrum quisque non. Blandit aliquam etiam erat velit
            scelerisque
            in dictum non consectetur. Et ultrices neque ornare aenean euismod. Dignissim sodales ut eu sem integer
            vitae
            justo. Justo eget magna fermentum iaculis eu non diam phasellus.
        </p>

        <p>
            Tortor condimentum lacinia quis vel eros donec ac odio tempor. Mi in nulla posuere sollicitudin aliquam
            ultrices
            sagittis orci. Est ullamcorper eget nulla facilisi etiam. Fames ac turpis egestas integer eget aliquet nibh
            praesent. Mollis nunc sed id semper risus in. Nisi porta lorem mollis aliquam ut porttitor. Faucibus nisl
            tincidunt eget nullam non nisi est sit amet. Tristique senectus et netus et malesuada fames ac turpis. Eu mi
            bibendum neque egestas congue. Urna et pharetra pharetra massa massa ultricies mi quis hendrerit. Feugiat in
            ante metus dictum at tempor commodo ullamcorper a. Sed risus pretium quam vulputate dignissim.
        </p>

        <p>
            Vulputate dignissim suspendisse in est. Purus gravida quis blandit turpis cursus. Netus et malesuada fames
            ac
            turpis. Feugiat in fermentum posuere urna nec tincidunt praesent. In ante metus dictum at. Congue mauris
            rhoncus
            aenean vel. Tempor id eu nisl nunc mi ipsum faucibus vitae aliquet. Tellus mauris a diam maecenas sed enim.
            Diam
            quam nulla porttitor massa id neque aliquam vestibulum morbi. Magna fermentum iaculis eu non diam phasellus
            vestibulum. Egestas maecenas pharetra convallis posuere morbi leo urna molestie. Magna eget est lorem ipsum
            dolor sit amet. Arcu cursus vitae congue mauris rhoncus aenean vel elit.
        </p>

        <p>
            Sit amet massa vitae tortor condimentum lacinia quis vel eros. Quis vel eros donec ac odio tempor. Augue
            neque
            gravida in fermentum et sollicitudin. Fermentum iaculis eu non diam phasellus vestibulum. Justo laoreet sit
            amet
            cursus sit amet dictum sit amet. Dui nunc mattis enim ut tellus elementum sagittis vitae. Id leo in vitae
            turpis
            massa. Pretium fusce id velit ut tortor pretium. Et malesuada fames ac turpis egestas. Eget duis at tellus
            at
            urna condimentum. Dolor sit amet consectetur adipiscing. Diam vel quam elementum pulvinar etiam non. Tempus
            egestas sed sed risus pretium quam vulputate dignissim. Libero enim sed faucibus turpis in eu mi bibendum.
            Morbi
            tristique senectus et netus et malesuada fames ac.
        </p>

        <p>
            In egestas erat imperdiet sed euismod nisi porta lorem mollis. Nulla posuere sollicitudin aliquam ultrices.
            Elit
            sed vulputate mi sit amet mauris commodo. Viverra adipiscing at in tellus integer. Laoreet sit amet cursus
            sit
            amet dictum. Nulla porttitor massa id neque aliquam vestibulum. Parturient montes nascetur ridiculus mus
            mauris
            vitae ultricies leo integer. In tellus integer feugiat scelerisque varius morbi enim nunc. Bibendum arcu
            vitae
            elementum curabitur vitae. Arcu cursus vitae congue mauris rhoncus aenean. Massa ultricies mi quis
            hendrerit.
            Ornare suspendisse sed nisi lacus. Justo eget magna fermentum iaculis eu. Viverra vitae congue eu consequat
            ac.
            Vulputate dignissim suspendisse in est ante in. Integer feugiat scelerisque varius morbi enim nunc.
        </p>

        <p>
            Pellentesque nec nam aliquam sem et tortor consequat. Augue eget arcu dictum varius duis at. Duis ut diam
            quam
            nulla porttitor massa id neque. Sed blandit libero volutpat sed cras ornare arcu dui. Eu augue ut lectus
            arcu
            bibendum at. Viverra suspendisse potenti nullam ac. Elementum nisi quis eleifend quam adipiscing vitae proin
            sagittis. Rutrum tellus pellentesque eu tincidunt tortor. Pellentesque sit amet porttitor eget dolor. Nulla
            aliquet porttitor lacus luctus accumsan tortor posuere ac ut. Fermentum leo vel orci porta non pulvinar.
            Enim
            blandit volutpat maecenas volutpat. Elit at imperdiet dui accumsan sit amet nulla. Erat imperdiet sed
            euismod
            nisi porta. In eu mi bibendum neque egestas congue quisque egestas diam. Auctor eu augue ut lectus arcu
            bibendum
            at varius vel.
        </p>

        <p>
            Tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus. Tristique et egestas quis ipsum
            suspendisse ultrices. Lectus quam id leo in vitae turpis massa sed. Erat pellentesque adipiscing commodo
            elit at
            imperdiet dui accumsan. Et malesuada fames ac turpis egestas integer eget. Odio facilisis mauris sit amet
            massa
            vitae tortor condimentum. Tortor pretium viverra suspendisse potenti nullam ac. Tempus urna et pharetra
            pharetra. Ut lectus arcu bibendum at varius vel pharetra vel turpis. Ut etiam sit amet nisl purus in.
        </p>

        <p>
            Venenatis urna cursus eget nunc scelerisque viverra. Varius duis at consectetur lorem donec massa. Arcu
            dictum
            varius duis at consectetur lorem. Vivamus arcu felis bibendum ut tristique et egestas. Faucibus pulvinar
            elementum integer enim. Tristique senectus et netus et malesuada. Nulla aliquet enim tortor at auctor urna
            nunc
            id cursus. Fames ac turpis egestas sed tempus urna et pharetra. Enim praesent elementum facilisis leo vel
            fringilla est. Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum. Duis at consectetur lorem
            donec massa sapien faucibus et. Neque convallis a cras semper auctor.
        </p>

        <p>
            Pulvinar elementum integer enim neque volutpat ac tincidunt. Elit sed vulputate mi sit amet mauris commodo.
            Massa tincidunt nunc pulvinar sapien et. Non sodales neque sodales ut etiam. Nunc id cursus metus aliquam
            eleifend mi in nulla. Nec sagittis aliquam malesuada bibendum. Tincidunt id aliquet risus feugiat in ante
            metus
            dictum. Ultricies lacus sed turpis tincidunt id aliquet. Nulla facilisi etiam dignissim diam quis enim
            lobortis
            scelerisque fermentum. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt. Suspendisse in
            est
            ante in nibh. Enim ut sem viverra aliquet eget. Mauris sit amet massa vitae tortor. Lobortis elementum nibh
            tellus molestie nunc non blandit massa enim. Tortor dignissim convallis aenean et tortor at risus.
            Scelerisque
            eleifend donec pretium vulputate sapien nec. Pellentesque habitant morbi tristique senectus et netus et.
            Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Tortor id aliquet lectus proin. Ultricies mi
            eget mauris pharetra et ultrices neque.
        </p>

        <p>
            Bibendum enim facilisis gravida neque. Purus non enim praesent elementum facilisis leo. Sed egestas egestas
            fringilla phasellus faucibus scelerisque eleifend donec. Rutrum quisque non tellus orci ac auctor augue. Leo
            in
            vitae turpis massa sed. Non quam lacus suspendisse faucibus interdum. Eu volutpat odio facilisis mauris sit.
            Vitae semper quis lectus nulla. Viverra justo nec ultrices dui sapien. Diam sit amet nisl suscipit
            adipiscing
            bibendum est ultricies integer. Nisl rhoncus mattis rhoncus urna.
        </p>

        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Maecenas volutpat blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
            Sit
            amet mattis vulputate enim nulla. Faucibus nisl tincidunt eget nullam non. Sem fringilla ut morbi tincidunt
            augue. Sed id semper risus in hendrerit gravida rutrum quisque non. Blandit aliquam etiam erat velit
            scelerisque
            in dictum non consectetur. Et ultrices neque ornare aenean euismod. Dignissim sodales ut eu sem integer
            vitae
            justo. Justo eget magna fermentum iaculis eu non diam phasellus.
        </p>

        <p>
            Tortor condimentum lacinia quis vel eros donec ac odio tempor. Mi in nulla posuere sollicitudin aliquam
            ultrices
            sagittis orci. Est ullamcorper eget nulla facilisi etiam. Fames ac turpis egestas integer eget aliquet nibh
            praesent. Mollis nunc sed id semper risus in. Nisi porta lorem mollis aliquam ut porttitor. Faucibus nisl
            tincidunt eget nullam non nisi est sit amet. Tristique senectus et netus et malesuada fames ac turpis. Eu mi
            bibendum neque egestas congue. Urna et pharetra pharetra massa massa ultricies mi quis hendrerit. Feugiat in
            ante metus dictum at tempor commodo ullamcorper a. Sed risus pretium quam vulputate dignissim.
        </p>

        <p>
            Vulputate dignissim suspendisse in est. Purus gravida quis blandit turpis cursus. Netus et malesuada fames
            ac
            turpis. Feugiat in fermentum posuere urna nec tincidunt praesent. In ante metus dictum at. Congue mauris
            rhoncus
            aenean vel. Tempor id eu nisl nunc mi ipsum faucibus vitae aliquet. Tellus mauris a diam maecenas sed enim.
            Diam
            quam nulla porttitor massa id neque aliquam vestibulum morbi. Magna fermentum iaculis eu non diam phasellus
            vestibulum. Egestas maecenas pharetra convallis posuere morbi leo urna molestie. Magna eget est lorem ipsum
            dolor sit amet. Arcu cursus vitae congue mauris rhoncus aenean vel elit.
        </p>

        <p>
            Sit amet massa vitae tortor condimentum lacinia quis vel eros. Quis vel eros donec ac odio tempor. Augue
            neque
            gravida in fermentum et sollicitudin. Fermentum iaculis eu non diam phasellus vestibulum. Justo laoreet sit
            amet
            cursus sit amet dictum sit amet. Dui nunc mattis enim ut tellus elementum sagittis vitae. Id leo in vitae
            turpis
            massa. Pretium fusce id velit ut tortor pretium. Et malesuada fames ac turpis egestas. Eget duis at tellus
            at
            urna condimentum. Dolor sit amet consectetur adipiscing. Diam vel quam elementum pulvinar etiam non. Tempus
            egestas sed sed risus pretium quam vulputate dignissim. Libero enim sed faucibus turpis in eu mi bibendum.
            Morbi
            tristique senectus et netus et malesuada fames ac.
        </p>

        <p>
            In egestas erat imperdiet sed euismod nisi porta lorem mollis. Nulla posuere sollicitudin aliquam ultrices.
            Elit
            sed vulputate mi sit amet mauris commodo. Viverra adipiscing at in tellus integer. Laoreet sit amet cursus
            sit
            amet dictum. Nulla porttitor massa id neque aliquam vestibulum. Parturient montes nascetur ridiculus mus
            mauris
            vitae ultricies leo integer. In tellus integer feugiat scelerisque varius morbi enim nunc. Bibendum arcu
            vitae
            elementum curabitur vitae. Arcu cursus vitae congue mauris rhoncus aenean. Massa ultricies mi quis
            hendrerit.
            Ornare suspendisse sed nisi lacus. Justo eget magna fermentum iaculis eu. Viverra vitae congue eu consequat
            ac.
            Vulputate dignissim suspendisse in est ante in. Integer feugiat scelerisque varius morbi enim nunc.
        </p>

        <p>
            Pellentesque nec nam aliquam sem et tortor consequat. Augue eget arcu dictum varius duis at. Duis ut diam
            quam
            nulla porttitor massa id neque. Sed blandit libero volutpat sed cras ornare arcu dui. Eu augue ut lectus
            arcu
            bibendum at. Viverra suspendisse potenti nullam ac. Elementum nisi quis eleifend quam adipiscing vitae proin
            sagittis. Rutrum tellus pellentesque eu tincidunt tortor. Pellentesque sit amet porttitor eget dolor. Nulla
            aliquet porttitor lacus luctus accumsan tortor posuere ac ut. Fermentum leo vel orci porta non pulvinar.
            Enim
            blandit volutpat maecenas volutpat. Elit at imperdiet dui accumsan sit amet nulla. Erat imperdiet sed
            euismod
            nisi porta. In eu mi bibendum neque egestas congue quisque egestas diam. Auctor eu augue ut lectus arcu
            bibendum
            at varius vel.
        </p>

        <p>
            Tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus. Tristique et egestas quis ipsum
            suspendisse ultrices. Lectus quam id leo in vitae turpis massa sed. Erat pellentesque adipiscing commodo
            elit at
            imperdiet dui accumsan. Et malesuada fames ac turpis egestas integer eget. Odio facilisis mauris sit amet
            massa
            vitae tortor condimentum. Tortor pretium viverra suspendisse potenti nullam ac. Tempus urna et pharetra
            pharetra. Ut lectus arcu bibendum at varius vel pharetra vel turpis. Ut etiam sit amet nisl purus in.
        </p>

        <p>
            Venenatis urna cursus eget nunc scelerisque viverra. Varius duis at consectetur lorem donec massa. Arcu
            dictum
            varius duis at consectetur lorem. Vivamus arcu felis bibendum ut tristique et egestas. Faucibus pulvinar
            elementum integer enim. Tristique senectus et netus et malesuada. Nulla aliquet enim tortor at auctor urna
            nunc
            id cursus. Fames ac turpis egestas sed tempus urna et pharetra. Enim praesent elementum facilisis leo vel
            fringilla est. Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum. Duis at consectetur lorem
            donec massa sapien faucibus et. Neque convallis a cras semper auctor.
        </p>

        <p>
            Pulvinar elementum integer enim neque volutpat ac tincidunt. Elit sed vulputate mi sit amet mauris commodo.
            Massa tincidunt nunc pulvinar sapien et. Non sodales neque sodales ut etiam. Nunc id cursus metus aliquam
            eleifend mi in nulla. Nec sagittis aliquam malesuada bibendum. Tincidunt id aliquet risus feugiat in ante
            metus
            dictum. Ultricies lacus sed turpis tincidunt id aliquet. Nulla facilisi etiam dignissim diam quis enim
            lobortis
            scelerisque fermentum. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt. Suspendisse in
            est
            ante in nibh. Enim ut sem viverra aliquet eget. Mauris sit amet massa vitae tortor. Lobortis elementum nibh
            tellus molestie nunc non blandit massa enim. Tortor dignissim convallis aenean et tortor at risus.
            Scelerisque
            eleifend donec pretium vulputate sapien nec. Pellentesque habitant morbi tristique senectus et netus et.
            Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Tortor id aliquet lectus proin. Ultricies mi
            eget mauris pharetra et ultrices neque.
        </p>

        <p>
            Bibendum enim facilisis gravida neque. Purus non enim praesent elementum facilisis leo. Sed egestas egestas
            fringilla phasellus faucibus scelerisque eleifend donec. Rutrum quisque non tellus orci ac auctor augue. Leo
            in
            vitae turpis massa sed. Non quam lacus suspendisse faucibus interdum. Eu volutpat odio facilisis mauris sit.
            Vitae semper quis lectus nulla. Viverra justo nec ultrices dui sapien. Diam sit amet nisl suscipit
            adipiscing
            bibendum est ultricies integer. Nisl rhoncus mattis rhoncus urna.
        </p>
    </div>
</body>
```