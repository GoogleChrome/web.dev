const data = [
    {
        description: "Watches",
        src: "https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/GMPpoERpp9aM5Rihk5F2.jpg"
    },
    {
        description: "Shirt",
        src: "shirt.jpg"
    },
    {
        description: "Shorts",
        src: "shorts.jpg"
    },
    {
        description: "Sunglasses",
        src: "sunglasses.jpg"
    },
    {
        description: "Shoes",
        src: "shoes.jpg"
    }
];
document.querySelectorAll(".item.empty").forEach((el, index) => {
    if (data[index]) {
        el.classList = "item loaded";
        el.querySelector("img").src = data[index].src;
        el.querySelector(".text-container").innerHTML = data[index].description;
    }
});
