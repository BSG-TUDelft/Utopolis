if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;
var material, dae, skin;

var mouse2D, mouse3D, raycaster, rollOveredFace;
var rollOverMesh, rollOverMaterial;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var i, intersector;

var buildings = new Array();

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( './art/meshes/structural/iber_temple.dae', function ( collada ) {
    dae = collada.scene;
    var texture = THREE.ImageUtils.loadTexture('./art/textures/skins/structural/iber_struct.png');
    material = new THREE.MeshLambertMaterial({map: texture});
    setMaterial(dae, material);
    dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
    dae.updateMatrix();

    init();
    animate();
} );

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 2, 2, 3 );

    scene = new THREE.Scene();

    // GRID
    // var size = 14, step = 1;
    // var geometry = new THREE.Geometry();
    // var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
    // for ( var i = - size; i <= size; i += step ) {
    //     geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
    //     geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
    //     geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
    //     geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
    // }
    // var line = new THREE.Line( geometry, material, THREE.LinePieces );
    // scene.add( line );

    // FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture( './art/textures/terrain/types/desert_lakebed_dry_b.png' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(40, 40, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    
    // Add the COLLADA
    scene.add( dae );

    // Lights
    scene.add( new THREE.AmbientLight( 0xcccccc ) );

    var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );

    // roll-over helpers
    rollOverGeo = new THREE.CubeGeometry( 1, 2, 1 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    scene.add( rollOverMesh );

    // picking
    projector = new THREE.Projector();

    mouse2D = new THREE.Vector3( 0, 10000, 0.5 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    // register event handlers
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    var intersects = raycaster.intersectObjects( scene.children );
    intersector = getRealIntersector( intersects );

    var i = buildings.length - 1;
    buildings[i] = dae.clone();
    buildings[i].position = intersector.point;
    scene.add(buildings[i]);
}

var angle = 0.0;

function onKeyDown ( event ) {
    switch( event.keyCode ) {
        case 87: // w  
            camera.position.z--; 
            break;
        case 83: // s
            camera.position.z++; 
            break;
        case 65: // a  
            camera.position.x--; 
            break;
        case 68: // d
            camera.position.x++; 
            break;
        case 69: // e  
            angle -= 0.05;
            camera.position.x = Math.cos( angle ) * 10;
            camera.position.z = Math.sin( angle ) * 10;
            break;
        case 81: // q  
            angle += 0.05;
            camera.position.x = Math.cos( angle ) * 10;
            camera.position.z = Math.sin( angle ) * 10;
            break;
        case 82: // r
            camera.position.y++; 
            break;
        case 70: // f  
            camera.position.y--; 
            break;
    }
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//

var t = 0;
var clock = new THREE.Clock();

function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame( animate );
    if ( t > 1 ) t = 0;

    render();
    stats.update();
}

function render() {
    var timer = Date.now() * 0.0005;

    // camera.position.x = Math.cos( timer ) * 10;
    // camera.position.y = 2;
    // camera.position.z = Math.sin( timer ) * 10;
    camera.lookAt( scene.position );

    raycaster = projector.pickingRay( mouse2D.clone(), camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        intersector = getRealIntersector( intersects );
        if ( intersector ) {
            setVoxelPosition( intersector );
            rollOverMesh.position = voxelPosition;
        }
    }

    renderer.render( scene, camera );
}

function getRealIntersector( intersects ) {
    for( i = 0; i < intersects.length; i++ ) {
        intersector = intersects[ i ];
        if ( intersector.object != rollOverMesh ) {
            return intersector;
        }
    }
    return null;
}

function setVoxelPosition( intersector ) {
    normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
    //tmpVec.copy( intersector.face.normal );
    tmpVec.applyMatrix3( normalMatrix ).normalize();
    voxelPosition.addVectors( intersector.point, tmpVec );
}

var setMaterial = function(node, material) {
    node.material = material;
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            setMaterial(node.children[i], material);
        }
    }
}
