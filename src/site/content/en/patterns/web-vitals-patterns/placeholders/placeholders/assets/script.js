const data = [
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