let gameOver = false

//poengsystem
const poengDisplay = document.querySelector(".poengDisplay")
let poeng = 0

//board
let board
let boardWidth = 360
let boardHeight = 576
let ctx

//doodler
let doodlerWidth = 46
let doodlerHeight = 46
let doodlerX = boardWidth / 2 - doodlerWidth / 2 //sentreres i bredden
let doodlerY = boardHeight - 50 - doodlerHeight
let doodlerRightImg
let doodlerLeftImg



//physics
let fartX = 0
let fartY = 0
let startfartY = -7
let g = 0.4

//platformer 
let platformArray = []
let platformWidth = 60
let platformHeight = 18
let platformImg



let doodler = {
    img: null, //hvis man bruker bilder i et objekt, må et av argumentene være kilden til bildet.
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

window.onload = function () {
    board = document.getElementById("board")
    board.width = boardWidth
    board.height = boardHeight
    ctx = board.getContext("2d")


    //laster inn bildene til doodler
    doodlerRightImg = new Image()
    doodlerRightImg.src = "./doodler-img/doodler-right.png"
    doodler.img = doodlerRightImg //objektet hadde tidligere "img: null"

    doodlerRightImg.onload = function () {
        ctx.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height)
    }

    doodlerLeftImg = new Image()
    doodlerLeftImg.src = "./doodler-img/doodler-left.png"

    //laster inn bildene til platformene
    platformImg = new Image()
    platformImg.src = "./doodler-img/platform.png"

    placePlatforms()
    fartY = startfartY
    requestAnimationFrame(oppdater) //starter gameloop
    document.addEventListener("keydown", flyttDoodler)



}



//gameloop
function oppdater() {
    requestAnimationFrame(oppdater)
    ctx.clearRect(0, 0, board.width, board.height)
    if (gameOver) {
        ctx.fillStyle = "black"
        ctx.font = "16px sans-serif"
        ctx.fillText("Game Over: press 'space' to Restart", boardWidth / 7, boardHeight * 7 / 8)
    }

    //doodler
    doodler.x += fartX
    if (doodler.x > board.width) {
        doodler.x = -doodler.width
    }
    else if (doodler.x + doodlerWidth < 0) {
        doodler.x = boardWidth
    }

    fartY += g
    doodler.y += fartY
    if (doodler.y > boardHeight) {
        gameOver = true
    }
    ctx.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height)

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let tile = platformArray[i] //objektene(platformene som er pushet) blir kalt tile lokalt i if-løkken

        if (fartY < 0 && doodler.y < boardHeight * 3 / 5) {
            tile.y += -startfartY
        }

        if (skjekkKollisjon(doodler, tile)) {
            fartY = startfartY
        }

        ctx.drawImage(tile.img, tile.x, tile.y, tile.width, tile.height)
    }

    //fjerner platform under brettet og legger til nye over
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift() //fjerner første element i listen
        newPlatform()

        poeng++
        poengDisplay.innerHTML = poeng
    }

}

//bevegelse funksjoner
function flyttDoodler(e) {
    if (e.key == "ArrowRight" || e.key == "d") {
        fartX = 5
        doodler.img = doodlerRightImg
    }
    else if (e.key == "ArrowLeft" || e.key == "a") {
        fartX = -5
        doodler.img = doodlerLeftImg
    }
    else if (e.key == " " && gameOver) {
        //reset game
        doodler.x = doodlerX
        doodler.y = doodlerY
        doodler.img = doodlerRightImg

        fartX = 0
        fartY = startfartY

        poeng = 0
        poengDisplay.innerHTML = poeng

        gameOver = false
        placePlatforms()
    }

}


function placePlatforms() {
    platformArray = [] //fjerner listeelementene 

    //starting platform
    let startPlatform = {
        img: platformImg,
        x: boardWidth / 2 - doodlerWidth / 2,
        y: boardHeight - 75,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(startPlatform)

    //5 andre platformer 
    for (let i = 0; i < 5; i++) {
        let randomX = Math.random() * boardWidth * 3 / 4

        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 150 - i * 100,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform)
    }
}

function newPlatform() {
    let randomX = Math.random() * boardWidth * 3 / 4

    let newPlatform = {
        img: platformImg,
        x: randomX,
        y: -doodlerHeight,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(newPlatform)
}

function skjekkKollisjon(doodler, tile) {
    return (
        doodler.x < tile.x + tile.width &&
        doodler.x + doodler.width > tile.x &&
        doodler.y < tile.y + tile.height &&
        doodler.y + doodler.height > tile.y &&
        fartY > 0
    )
}