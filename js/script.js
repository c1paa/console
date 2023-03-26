let textarea = document.querySelector(".main-textarea");
let dir = ["C:"];
let dir_str = "";
let commands = ["cd", "color", "clear", "list", "new", "del", "help", "font"];
let transfer = true;
let colorTextNum = 0;
let colorBackNum = 0;
let font_s = 15;
let colorsText = {
    0 : "white",
    1 : "greenyellow", 
    2 : "blue",
    3 : "red",
    4 : "aqua",
    5 : "yellow",
    6 : "purple",
    7 : "green",
    8 : "black"
}
let colorsBack = {
    0 : "#252525",
    1 : "white", 
    2 : "blue",
    3 : "red",
    4 : "aqua",
    5 : "yellow",
    6 : "purple",
    7 : "black"
}

let disk = {
    "C:" : {
        "web" : {
            "vlad" : "index.html",
            "oleg" : "domitex.html"
        },
        "oleg" : {
            "python" : "main.py"
        },
        "vlad" : {
            "c++" : {
                "zmeika" : "Main.cpp",
                "project" : "Source.cpp"
            },
            "python" : {
                "alice" : "main.py",
                "parse_bot" : "main.py"
            },
            "c#" : {
                "Program" : "Program.cs"
            }
        }
    }
}

dir_str = update_dir();
update_console(dir_str, false);

function update_console(d, ent) {
    if (ent) textarea.textContent += "\n";

    textarea.style.color = colorsText[colorTextNum];
    textarea.style.background = colorsBack[colorBackNum];
    textarea.textContent += d;
    textarea.style.fontSize = font_s + 'px';

    textarea.focus();
    const range = document.createRange();
    range.selectNodeContents(textarea);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    setInterval(function() {          
	    window.scrollTo(0, document.body.scrollHeight);
    }, 1000);
}

function insertImage() {
    let image = document.createElement('img');
    image.src = "../img/win_logo.png";
    selection = window.getSelection();
    if (selection.rangeCount === 0 /* нет выделения */ ||
      // выделение лежит не в #conteneditable
      !textarea.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      // вставляем в конец элемента #editable
      textarea.appendChild(image);
    } else {
      let range = selection.getRangeAt(0);
      // сжимаем range в его правый конец
      range.collapse(false);
      // вставляем картинку
      range.insertNode(image);
  
      // делаем, чтобы курсор был после вставленной картинки
      selection.removeAllRanges();
      range.setStartAfter(image);
      selection.addRange(range);
    }
  }

function update_dir() {
    return dir.join("/") + " $ ";
}

function print_consoleText(text) {
    textarea.textContent = textarea.textContent + text;
}

textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        let com = String(textarea.textContent).split(dir_str)[String(textarea.textContent).split(dir_str).length-1].replace(dir_str, "");
        console.log(com);
        execute_command(com.split(" ")[0], com);
        update_console(dir_str, transfer);
        transfer = true;
        com = "";
    }
});

function execute_command(com_word, all_com) {
    if (com_word == ''){
        return;
    }
    for (let i = 0; i < commands.length; i++){
        if (com_word == commands[i]){
            if (com_word == "cd"){
                if (all_com.replace(com_word, "") == "" || all_com.replace(com_word, "") == " "){
                    print_consoleText(`\nНе указаны обязательные параметры.`);
                    return false;
                }
                let path = all_com.replace(com_word+" ", "").split('/');
                let new_dir = [];
                let finish_cd = true;
                let p = disk;
                if (path[path.length-1] == '') path.pop();
                if (path[0] == "C:") {
                    new_dir = [];
                    dir = [];
                } else {
                    for (let i = 0; i < dir.length; i++){
                        p = p[dir[i]];
                    }
                    new_dir = dir;
                }
                for (let i = 0; i < path.length; i++){
                    if (path[i] == ".."){
                        if (new_dir.length > 1){
                            new_dir.pop();
                            p = disk;
                            for (let i = 0; i < new_dir.length; i++){
                                p = p[new_dir[i]];
                            }
                        } else {
                            finish_cd = false;
                            break;
                        }
                    } else {
                        let pt = p;
                        pt = pt[path[i]];
                        if (pt) {
                            new_dir.push(path[i]);
                            p = disk;
                            for (let i = 0; i < new_dir.length; i++){
                                p = p[new_dir[i]];
                            }
                        } else {
                            finish_cd = false;
                            break;
                        }
                    }
                }
                dir = new_dir;
                if (finish_cd) {
                    dir_str = dir.join("/") + " $ ";
                    print_consoleText(`\nКоманда "${com_word}" выполнена успешно.`);
                    return true;
                } else {
                    dir_str = dir.join("/") + " $ ";
                    print_consoleText(`\nДанная директория не найдена.`);
                    return false;
                }
                // console.log(dir_str);
            } else if (com_word == "list"){
                let p = disk;
                for (let i = 0; i < dir.length; i++){
                    p = p[dir[i]];  
                }
                let k = Object.keys(p);
                if (k[0] !== 0){
                    // console.log(Object.values(p));
                    for (let i = 0; i < k.length; i++){
                        print_consoleText(`\n${k[i]}`);
                    }
                    // let s = document.createElement("a");
                    // s.textContent = "Hello";
                    // s.href = "https://reshimvse.com/article.php?id=135";
                    // // textarea.appendChild(s);
                    // textarea.execCommand('CreateLink', false, s);
                    insertImage();
                    return true;
                }
                print_consoleText(`\nНе найдено директорий в данной папке.`);
                return false;
            } else if (com_word == "new"){
                // if (all_com.split('').splice(0, com_word.length+1).join('') == "" //||
                // // (all_com.replace(com_word, "").split(" ").length <=1 && 
                // // (all_com.replace(com_word, "").split(" ")[-1] != "" ||
                // // all_com.replace(com_word, "").split(" ")[0] != ""))){
                // ){
                //     print_consoleText(`\nНе указаны обязательные параметры.`);
                //     return false;
                // }
                console.log(all_com.split("").splice(0, com_word.length+1).join(""));
                let p = disk;
                let type = all_com.replace(com_word+" ", "").split(" ")[0];
                let n = all_com.replace(com_word+" ", "").replace(type+" ", "");
                for (let i = 0; i < dir.length; i++){
                    p = p[dir[i]];  
                }
                if (type == "--d") {
                    p[n] = {};
                    print_consoleText(`\nНовая директория "${n}" успешно создана.`);
                    return true;
                } else if (type == "--f") {
                    p[n] = "";
                    print_consoleText(`\nНовый файл "${n}" успешно создан.`);
                    return true;
                } else {
                    print_consoleText(`\nОбъект не был создан.`);
                    return false;
                }
            } else if (com_word == "del"){
                if (all_com.replace(com_word, "") == "" || all_com.replace(com_word, "") == " "){
                    print_consoleText(`\nНе указаны обязательные параметры.`);
                    return false;
                }
                let p = disk;
                let n = all_com.replace(com_word+" ", "");
                for (let i = 0; i < dir.length; i++){
                    p = p[dir[i]];  
                }
                if (p[n] || p[n] == ""){
                    delete p[n];
                    print_consoleText(`\nОбъект "${n}" успешно удалён.`);
                    return true;
                } else {
                    print_consoleText(`\nОбъект "${n}" не найден в текущей директории`);
                    return false;
                }
                
            } else if (com_word == "clear") {
                textarea.textContent = '';
                transfer = false;
                return true;
            } else if (com_word == "color"){
                if (Number(all_com.replace(com_word+" ", "")) != NaN){
                    if (String(all_com.replace(com_word+" ", "")).length == 1){
                        colorTextNum = Number(all_com.replace(com_word+" ", ""));
                    } else if (String(all_com.replace(com_word+" ", "")).length == 2){
                        colorTextNum = Number(String(all_com.replace(com_word+" ", ""))[0]);
                        colorBackNum = Number(String(all_com.replace(com_word+" ", ""))[1]);
                    }else if (all_com.replace(com_word+" ", "") == "reset") {
                        colorTextNum = 0;
                        colorBackNum = 0;
                        // console.log("resetting colors!");
                        print_consoleText(`\nКоманда "${com_word}" выполнена успешно.`);
                        console.log("2");
                        return true;
                    } else {
                        print_consoleText(`\nКоманда "${com_word}" не имеет такого значения.`);
                        return false;
                    }
                    print_consoleText(`\nКоманда "${com_word}" выполнена успешно.`);
                    console.log("1");
                    return true;
                }                
            } else if (com_word == "font") {
                if (all_com.replace(com_word, "") == "" || all_com.replace(com_word, "") == " "){
                    print_consoleText(`\nНе указаны обязательные параметры.`);
                    return false;
                }
                let size = all_com.replace(com_word+" ", "");
                if (size){
                    if (size == "reset") size = 15;
                    font_s = Number(size);
                    print_consoleText(`\nРазмер текста успешно изменен.`);
                    return true;
                } else {
                    print_consoleText(`\nПараметры указаны неправильно.`);
                    return false;
                }
            } else if (com_word == "help") {
                print_consoleText(`\ncd - сменить директорию\nlist - узнать все объекты в текущей дериктории\nnew - создать объект, --f -> файл, --d -> папка, new <тип> <имя>\ndel - удалить объект\nclear - очистить консоль\ncolor - задать цвет 12 -> 1-цвет текста, 2-цвет заднего фона, color reset - сбросить все цвета\nfont - изменить размер текста`);
                return true;
            }
            return true;
        }
    }
    print_consoleText(`\n"${com_word}" не является внутренней или внешней командой.`);
    return false;
}

