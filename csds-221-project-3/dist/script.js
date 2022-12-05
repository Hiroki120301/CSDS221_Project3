let board = [];
let rows = 8;
let cols = 8;

let num_mines = set_random();
let mine_pos = []

let tile_clicked = 0;
let flag_enabled = false;
let game_over = false;
let num_clicks = 0;

window.onload = function() {
    start_game();
}

function set_random(){
    let minimum = Math.ceil(4);
    let maximum = Math.floor(9);
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function set_mines(){
    let mines_left = num_mines;
    while (mines_left > 0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id = r.toString() + "-" + c.toString();

        if (!mine_pos.includes(id)){
            mine_pos.push(id)
            mines_left -= 1;
        }
    }
}

function start_game() {
    document.getElementById("num-of-mines").innerText = num_mines;
    document.getElementById("flag-button").addEventListener("click", set_flag);
    set_mines();

    for (let r = 0; r < rows; r++){
        let row = [];
        for(let c = 0; c < cols; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", click_tile)
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board)
}

function set_flag(){
    if (flag_enabled){
        flag_enabled = false;
        document.getElementById("flag-button").style.backgroundColor = "teal"
    }else{
        flag_enabled = true;
        document.getElementById("flag-button").style.backgroundColor = "aqua"
    }
}

function click_tile(){
    if(!game_over)
    {
        let tile = this;

        if (flag_enabled) {
            if (tile.innerText === "") {
                tile.innerText = "🚩";
            } else if (tile.innerText === "🚩") {
                tile.innerText = ""
            }
            return;
        }
        num_clicks++;
        document.getElementById("num_clicks").innerText = num_clicks;
        if (mine_pos.includes(tile.id)) {
            toastr.error("GAME OVER")
            game_over = true;
            reveal_mines();
            return;
        }

        let coords = tile.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        check_mines(r, c);
    }
}

function check_mines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c > cols){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }
    board[r][c].classList.add("tile-clicked")
    tile_clicked += 1;

    let mines_found = 0;
    mines_found += check_tile(r-1, c-1);
    mines_found += check_tile(r-1, c);
    mines_found += check_tile(r-1, c+1);
    mines_found += check_tile(r, c-1);
    mines_found += check_tile(r, c+1);
    mines_found += check_tile(r+1, c-1);
    mines_found += check_tile(r+1, c);
    mines_found += check_tile(r+1, c+1);

    if(mines_found > 0){
        board[r][c].innerText = mines_found;
        board[r][c].classList.add("x" + mines_found.toString())
    }else{
        check_mines(r-1, c-1);
        check_mines(r-1, c);
        check_mines(r-1, c+1);

        check_mines(r, c+1);
        check_mines(r, c-1);

        check_mines(r+1, c-1);
        check_mines(r+1, c);
        check_mines(r+1, c+1);
    }

    if(tile_clicked === (rows * cols - num_mines)){
        document.getElementById("num-of-mines").innerText = "Cleared"
        toastr.success("CLEARED!!")
        game_over = true
    }
}

function check_tile(r, c){
    if (r < 0 || r >= rows || c < 0 || c > cols){
        return 0;
    }

    if(mine_pos.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}

function reveal_mines(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let tile = board[r][c];
            if (mine_pos.includes(tile.id)){
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}