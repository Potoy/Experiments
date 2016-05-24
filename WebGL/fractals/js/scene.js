if(! Detector.webgl) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;


var camera;
var renderer;
var gl;
var scene, container;
var frustumSize = 600;

init();

animate();


function init()
{
	//scene secttion
	scene = new THREE.Scene();

	container = document.getElementById( 'container' );

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1);

	gl =  renderer.getContext('webgl');
	if(!gl.getExtension("OES_texture_float"))
	{
		throw("Requieres OES_texture_float extension");
	}
	if(!gl.getExtension("OES_texture_float_linear"))
	{
		throw("Requires OES_texture_float_linear extension")
	}

	var colores = paletacolores();

	var fullquad = new THREE.Mesh(
		new THREE.PlaneGeometry(2,2),
		new THREE.ShaderMaterial({
			uniforms:{ tex: {value: colores},
					   center: {value: new THREE.Vector2( 0, 0 )},
					   scale: {value: 1.0}},
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			depthWrite: false,
    		depthTest: false
		})

	);

	scene.add(fullquad);

	//camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	camera.position.z = 200;

	scene.add( camera );

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight  );
	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.top = "0px";
	container.appendChild( stats.domElement );

	onWindowResize();

	window.addEventListener('resize', onWindowResize, false);

}

function paletacolores()
{
	var canvas = document.createElement('canvas');
	canvas.height = 1;
	canvas.width = 256;

	var ctx = canvas.getContext('2d');

	var grd = ctx.createLinearGradient(0,0,canvas.width-1,canvas.height-1);
	grd.addColorStop(0,'black');
	grd.addColorStop(0.2,'red');
	grd.addColorStop(0.45,'yellow');
	grd.addColorStop(0.55,'white');
	grd.addColorStop(0.6,'yellow');
	grd.addColorStop(0.8,'red');
	grd.addColorStop(1,'black');
	// grd.addColorStop(7,);
	// grd.addColorStop(8,);

	ctx.fillStyle = grd;
	ctx.fillRect(0,0,canvas.width-1, canvas.height-1);	

	var transferTexture = new THREE.Texture(canvas);
	transferTexture.wrapS = transferTexture.wrapT = THREE.ClampToEdgeWrapping;
	transferTexture.magFilter = THREE.NearestFilter;

	console.log(transferTexture);

	return transferTexture;

}


function onWindowResize ( event )
{
	camera.aspect = (window.innerWidth/ window.innerHeight);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate()
{
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render()
{
	//svar delta = clock.getDelta();

	renderer.render (scene,camera);
}