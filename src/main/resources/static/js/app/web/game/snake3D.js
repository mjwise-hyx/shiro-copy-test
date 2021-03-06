var renderer;
var camera;
var scene;
var light;
var cube = [];
var plane;
var fo;
var start_scene;
function Init()
{
    width = document.getElementById('canvas3d').clientWidth;
    height = document.getElementById('canvas3d').clientHeight;
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    document.getElementById('canvas3d').appendChild(renderer.domElement);
    renderer.setClearColor('pink', 1.0);
    camera = new THREE.PerspectiveCamera(45, width / height , 1 , 5000);
    camera.position.x = 0;
    camera.position.y = -280;
    camera.position.z = 200;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    camera.lookAt({x:0, y:0, z:0});
    scene = new THREE.Scene();

    light = new THREE.DirectionalLight('white', 1.0, 0);
    light.position.set( -600, -600, -600 );
    scene.add(light);
    plane = CreatePlane(400);
    plane.position.set(-5, -5, -5);
    scene.add(plane);
    //start_scene
    start_scene = new THREE.Scene();
    word = CreateText('snake 3D', 80, 40);
    word2 = CreateText('press any key to start', 30, 20);
    start_scene.add(word);
    start_scene.add(word2);
    start_scene.add(light);
    renderer.render(start_scene, camera);

    for (i = 0;i < nx;i++)
    {
        board[i] = new Array()
        for (k = 0;k < ny;k++)
        {
            board[i][k] = 0;
        }
    }//0 = none, 1 = snake body, 2 = food
    fo = CreateCube(10, 10, 50);
    scene.add(fo);
    document.addEventListener('keydown', onKeyDown, false);
    for (i = 0;i < len;i++)
    {
        snake[i] = new Object();
        snake[i].x = head_pos_x + i * dir_x[3 - head_for];
        snake[i].y = head_pos_y + i * dir_y[3 - head_for];
        cube[i] = CreateCube(10, 10, 10);
        cube[i].position.x = snake[i].x * 10 - 200;
        cube[i].position.y = -snake[i].y * 10 + 190;
        scene.add(cube[i]);
        board[snake[i].x][snake[i].y] = 1;
    }

}
function CreateText(_text, _z, _size)
{
    var material = new THREE.MeshFaceMaterial( [
        new THREE.MeshPhongMaterial( { color: 'yellow', shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 'yellow', shading: THREE.SmoothShading } ) // side
    ] );
    var text = _text,
        height = 20,
        size = _size,
        curveSegments = 4,
        font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
        weight = "bold", // normal bold
        style = "normal"; // normal italic
    textGeo = new THREE.TextGeometry( text, {
        size: size,
        height: height,
        curveSegments: curveSegments,
        font: font,
        weight: weight,
        style: style,
    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textMesh1 = new THREE.Mesh( textGeo, material );
    textMesh1.position.x = centerOffset;
    textMesh1.position.y = 0;
    textMesh1.position.z = _z;
    textMesh1.rotation.x = Math.PI / 2.5;
    textMesh1.rotation.y = Math.PI * 2;
    return textMesh1;
}
function CreateCube(_s1, _s2, _s3)
{
    var geometry = new THREE.BoxGeometry(_s1, _s2, _s3);
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5, wireframe: false } );
    return new THREE.Mesh( geometry, material );
}
function CreatePlane(_size)
{
    var geometry = new THREE.PlaneGeometry(_size, _size, 40, 40);
    var material = new THREE.MeshBasicMaterial( {color:'green', overdraw: 0.5, wireframe: false } );
    return new THREE.Mesh( geometry, material );
}
function animate()
{
    requestAnimationFrame(animate);
    render();
}
function render()
{

    for (var i = 0;i < len;++i)
    {
        cube[i].position.x = snake[i].x * 10 - 200;
        cube[i].position.y = -snake[i].y * 10 + 190;
    }
    camera.position.y = -snake[0].y * 3 - 300;
    camera.position.x = snake[0].x * 3 - 100;
    renderer.render(scene, camera);
}
var nx = 40, ny = 40, size = 20, start_point_x = 100, start_point_y = 50;
var len = 3;
var head_pos_x = 10, head_pos_y = 10, head_for = 2;
var dir_x = new Array(0, -1, 1, 0);
var dir_y = new Array(1, 0, 0, -1);
var status = -1;//the status of the game, -1 represents not start
var pause_flag = false;
var board = new Array();
var the_last_head = head_for;
var snake = new Array();

function reload_game()
{
    location.reload();
}

function move()
{
    var tx = snake[0].x + dir_x[head_for];
    var ty = snake[0].y + dir_y[head_for];
    //tx = (tx + nx) % nx;
    //ty = (ty + ny) % ny;
    if (tx >= 0 && tx < nx && ty >= 0 && ty < ny)
    {
        if (board[tx][ty] != 1)
        {
            the_last_head = head_for;
            if (board[tx][ty] == 2)
            {
                snake[len] = new Object();
                snake[len].x = snake[len - 1].x;
                snake[len].y = snake[len - 1].y;
                cube[len] = CreateCube(10, 10, 10);
                cube[len].position.x = snake[len].x * 10 - 200;
                cube[len].position.y = -snake[len].y * 10 + 190;
                scene.add(cube[len]);
                board[tx][ty] = 1;
                len++;
                food();
            }
            for (i = len - 1;i > 0;i--)
            {
                snake[i].x = snake[i - 1].x;
                snake[i].y = snake[i - 1].y;
            }
            snake[0].x = tx;
            snake[0].y = ty;
        }
        else
        {
            if (the_last_head + head_for != 3)
            {
                alert("game over!\ryour score is " + len);
                location.reload();
            }
            else
            {
                head_for = the_last_head;
            }
        }
    }
    else
    {
        alert("game over!\ryour score is " + len);
        location.reload();
    }
    for (i = 0;i < nx;i++)
    {
        for (k = 0;k < ny;k++)
        {
            if (board[i][k] == 1)
                board[i][k] = 0;
        }
    }
    for (i = 0;i < len;i++)
    {
        board[snake[i].x][snake[i].y] = 1;
    }
}

function food()
{
    var tx, ty;
    do
    {
        tx = Math.ceil(Math.random()*1000) % nx;
        ty = Math.ceil(Math.random()*1000) % ny;
    }while(board[tx][ty]);
    board[tx][ty] = 2;
    fo.position.x = tx * 10 - 200;
    fo.position.y = -ty * 10 + 190;
    fo.position.z = 20;
}
function run()
{
    if (!pause_flag)
        move();

    render();
    setTimeout("run()", 100);//you can change speed here
}

function onKeyDown(event)
{
    if (status == -1)
    {
        status = 0;
        food();
        run();
    }
    if(window.event) // IE
    {
        keynum = event.keyCode;
    }
    else if(event.which) // Netscape/Firefox/Opera
    {
        keynum = event.which;
    }
    if (keynum == 38 && head_for != 0)
        head_for = 3;
    if (keynum == 40 && head_for != 3)
        head_for = 0;
    if (keynum == 37 && head_for != 2)
        head_for = 1;
    if (keynum == 39 && head_for != 1)
        head_for = 2;
    if (keynum == 80)
        pause_flag = !pause_flag;
    if (keynum != 80)
        pause_flag = false;
}
