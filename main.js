import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";



let skeleton, mixer;
let motion = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
let keyMap = {};
let delta = 0.008; // seconds
let moveDistante = 20 * delta; // 20 pixels per second
let rotateAngle = (Math.PI / 2) * delta;
let tTracker = false;
let lTracker = false;
let rTracker = false;
let Tracker8 = false;
let Tracker9 = false;
let xTracker = false;
let sphereObject;

const crossFadeControls = [];

let currentBaseAction = "idle";
const allActions = [];
const baseActions = {
  idle: { weight: 1 },
  walk: { weight: 0 },
  run: { weight: 0 },
};
const additiveActions = {
  sneak_pose: { weight: 0 },
  sad_pose: { weight: 0 },
  agree: { weight: 0 },
  headShake: { weight: 0 },
};
let numAnimations;

const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.translateX(3.0).translateY(-0.09).translateZ(-2.5);
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

const hemiLight = new THREE.HemisphereLight(0x606060, 0x2a2a35);
hemiLight.position.set(0, 1, 0);
scene.add(hemiLight);


// texture
const walle = new THREE.TextureLoader().load(
    "/exterior_wall.jpg"
  );
walle.wrapS = THREE.RepeatWrapping;
walle.wrapT = THREE.RepeatWrapping;
walle.repeat.set(4, 1.5);

const texture2 = new THREE.TextureLoader().load(
    "/interior_wall.jpg"
  );
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture2.repeat.set(4, 1);

const texture3 = new THREE.TextureLoader().load("/ceiling.jpg");
texture3.wrapS = THREE.RepeatWrapping;
texture3.wrapT = THREE.RepeatWrapping;
texture3.repeat.set(32, 32);

const texture4 = new THREE.TextureLoader().load("/floor.jpg");
texture4.wrapS = THREE.RepeatWrapping;
texture4.wrapT = THREE.RepeatWrapping;
texture4.repeat.set(32, 32);

const texture5 = new THREE.TextureLoader().load("/4.jpg");
const texture6 = new THREE.TextureLoader().load("/5.jpg");
const texture7 = new THREE.TextureLoader().load("/6.jpg");
const texture8 = new THREE.TextureLoader().load(
        "/monalisa.jpg"
    );

const texture9 = new THREE.TextureLoader().load(
          "/carucuboi.jpg"
        );
const texture10 = new THREE.TextureLoader().load("/1.jpg");
const texture11 = new THREE.TextureLoader().load("/2.jpg");
const texture12 = new THREE.TextureLoader().load("/3.jpg");
const texture13 = new THREE.TextureLoader().load(
        "/alexander.jpg"
    );


//floor

const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 10, 20, 20),
    new THREE.MeshPhongMaterial({ map: texture4, side: THREE.DoubleSide })
    );
mesh.rotation.x = Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// ceiling
const planeGeometry3 = new THREE.PlaneGeometry(8, 10, 20, 20);
const planeMaterial3 = new THREE.MeshPhongMaterial({
  map: texture3,
  side: THREE.DoubleSide,
});
const planeObject3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
scene.add(planeObject3);
planeObject3.translateX(0.0).translateY(2.5).translateZ(0.0);
planeObject3.rotation.x = Math.PI / 2;

// Pictures
const pic1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2),
    new THREE.MeshPhongMaterial({ map: texture5, side: THREE.DoubleSide })
  );
  scene.add(pic1);
  pic1.translateX(3.97).translateY(1.26).translateZ(2.0);
  pic1.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

const pic2 = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2),
    new THREE.MeshPhongMaterial({ map: texture6, side: THREE.DoubleSide })
  );
scene.add(pic2);
pic2.translateX(1.6).translateY(1.26).translateZ(4.8);
pic2.rotation.y = Math.PI / 2;
pic2.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

const pic3 = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2),
    new THREE.MeshPhongMaterial({ map: texture7, side: THREE.DoubleSide })
  );
scene.add(pic3);
pic3.translateX(-3.95).translateY(1.26).translateZ(-0.2);
pic3.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

const pic4 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.8),
    new THREE.MeshPhongMaterial({ map: texture9, side: THREE.DoubleSide })
  );
scene.add(pic4);
pic4.translateX(-2.05).translateY(1.26).translateZ(-0.55);
pic4.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

const pic5 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2),
    new THREE.MeshPhongMaterial({ map: texture8, side: THREE.DoubleSide })
  );
scene.add(pic5);
pic5.translateX(-3.95).translateY(1.26).translateZ(3.5);
pic5.rotation.x = Math.PI / 2;
pic5.rotation.y = Math.PI / 2;
pic5.rotateOnAxis(new THREE.Vector3(0, 0, -1), Math.PI / 2);

const pic6 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.8),
    new THREE.MeshPhongMaterial({
      map: texture10,
      side: THREE.DoubleSide,
    })
  );
scene.add(pic6);
pic6.translateX(-4.5).translateY(1.26).translateZ(5.1);
pic6.rotation.y = Math.PI / 2;
pic6.rotateOnAxis(new THREE.Vector3(0, -1, 0), Math.PI / 2);

const pic7 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshPhongMaterial({
      map: texture11,
      side: THREE.DoubleSide,
    })
  );
scene.add(pic7);
pic7.translateX(-2.5).translateY(1.55).translateZ(-3.75);
pic7.rotation.y -= Math.PI / 2;
pic7.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
//pic7.rotateOnAxis(new THREE.Vector3(0, -1, 0), Math.PI / 2);

const pic8 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.8),
    new THREE.MeshPhongMaterial({
      map: texture12,
      side: THREE.DoubleSide,
    })
  );
scene.add(pic8);
pic8.translateX(3.97).translateY(1.6).translateZ(-3);
pic8.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

const pic9 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 2),
    new THREE.MeshPhongMaterial({
      map: texture13,
      side: THREE.DoubleSide,
    })
  );
scene.add(pic9);
pic9.translateX(0.0).translateY(1.26).translateZ(-3.85);
pic9.rotation.y = Math.PI / 2;
pic9.rotateOnAxis(new THREE.Vector3(0, -1, 0), Math.PI / 2);


// Building

// leftwall
const cubeGeometry2 = new THREE.BoxGeometry(2.5, 1, 10);
const cubeMaterial2 = new THREE.MeshPhongMaterial({ map: walle });
const leftWall = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
scene.add(leftWall);

// Set Position of the cube
leftWall.translateX(-4.5).translateY(1.26).translateZ(0.0);
leftWall.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);

//backwall
const cubeGeometry1 = new THREE.BoxGeometry(2.5, 1, 8);
const cubeMaterial1 = new THREE.MeshPhongMaterial({ map: walle });
const backwall = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
scene.add(backwall);

// Set position of the cube
backwall.translateX(0.0).translateY(1.26).translateZ(-4.5);
backwall.rotation.x = Math.PI / 2;
backwall.rotation.y = Math.PI / 2;

// rightwall
const cubeGeometry = new THREE.BoxGeometry(2.5, 1, 10);
const cubeMaterial = new THREE.MeshPhongMaterial({ map: walle });
const rightWall = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(rightWall);

// Set Position of the cube
rightWall.translateX(4.5).translateY(1.26).translateZ(0.0);
rightWall.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);

 // Interior walls
 // Wall1
const cubeGeometryW = new THREE.BoxGeometry(2.45, 1, 2);
const cubeMaterialW = new THREE.MeshPhongMaterial({ map: texture2 });
const Wall1 = new THREE.Mesh(cubeGeometryW, cubeMaterialW);
scene.add(Wall1);

// Set Position of the cube
Wall1.translateX(-1.5).translateY(1.26).translateZ(3.9);
Wall1.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);

// Wall3
const cubeGeometryW3 = new THREE.BoxGeometry(2.45, 1, 2);
const cubeMaterialW3 = new THREE.MeshPhongMaterial({ map: texture2 });
const Wall3 = new THREE.Mesh(cubeGeometryW3, cubeMaterialW3);
//scene.add(Wall3);

// Set Position of the cube
Wall3.translateX(3.0).translateY(1.26).translateZ(-0.2);
Wall3.rotation.x = Math.PI / 2;
Wall3.rotation.y = Math.PI / 2;

// Wall 4
const cubeGeometryW4 = new THREE.BoxGeometry(2.45, 1, 2);
const cubeMaterialW4 = new THREE.MeshPhongMaterial({ map: texture2 });
const Wall4 = new THREE.Mesh(cubeGeometryW4, cubeMaterialW4);
scene.add(Wall4);

// Set Position of the cube
Wall4.translateX(-1.5).translateY(1.26).translateZ(-0.6);
Wall4.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);

// frontWall
const cubeGeometryF = new THREE.BoxGeometry(2.5, 0.01, 8);
const cubeMaterialF = new THREE.MeshPhongMaterial({
          color: "rgb(255,250,250)",
          transparent: true,
          opacity: 0.9,
        });
const frontWall = new THREE.Mesh(cubeGeometryF, cubeMaterialF);
scene.add(frontWall);

// Set Position of the cube
frontWall.translateX(0.0).translateY(1.25).translateZ(4.95);
frontWall.rotation.x = Math.PI / 2;
frontWall.rotation.y = Math.PI / 2;

// Load Models
const loader = new GLTFLoader();
let obj, obj2, obj3, obj4, obj5;

/*loader.load("/robot_a04/scene.gltf", function (gltf) {
    obj = gltf.scene;
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    scene.add(gltf.scene);
    obj.translateX(-3.0).translateY(1.55).translateZ(-3); // x stanga dreapta, y sus jos , z fata spate
    obj.rotation.y -= Math.PI / 2;
    obj.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
});*/

loader.load("./modern_door/scene.gltf", function (gltf2) {
    obj2 = gltf2.scene;
    gltf2.scene.scale.set(0.1, 0.15, 0.1);
    scene.add(gltf2.scene);
    obj2.translateX(-3.0).translateY(0.01).translateZ(4.95);
    obj2.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
});

loader.load("./book/scene.gltf", function (gltf3) {
    obj3 = gltf3.scene;
    gltf3.scene.scale.set(0.0034, 0.002, 0.0034);
    scene.add(gltf3.scene);
    obj3.translateX(3.0).translateY(0.45).translateZ(-2.8);
    obj3.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    obj3.rotation.y += 2.0;
  });

  loader.load("./stool/scene.gltf", function (gltf4) {
    obj4 = gltf4.scene;
    gltf4.scene.scale.set(0.002, 0.0015, 0.004);
    scene.add(gltf4.scene);
    obj4.translateX(3.0).translateY(0.0).translateZ(-2.8);
    obj4.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  });

  loader.load("./ink_and_quill/scene.gltf", function (gltf5) {
    obj5 = gltf5.scene;
    gltf5.scene.scale.set(1, 1, 1);
    scene.add(gltf5.scene);
    obj5.translateX(3.0).translateY(0.5).translateZ(-2.8);
    obj5.rotation.y += 1.1;
    obj5.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  });

  loader.load(
    "/Xbot.glb",
    function (gltf) {
      const model = gltf.scene;
      scene.add(model);
      model.translateX(-3.0).translateY(0.05).translateZ(-3);
      model.rotation.y -= Math.PI / 2;
      model.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

      model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });

      skeleton = new THREE.SkeletonHelper(model);
      skeleton.visible = false;
      scene.add(skeleton);

      const animations = gltf.animations;
      mixer = new THREE.AnimationMixer(model);

      numAnimations = animations.length;

      for (let i = 0; i !== numAnimations; ++i) {
        let clip = animations[i];
        const name = clip.name;

        if (baseActions[name]) {
          const action = mixer.clipAction(clip);
          activateAction(action);
          baseActions[name].action = action;
          allActions.push(action);
        } else {
          // make the clip additive and remove the reference frame

          THREE.AnimationUtils.makeClipAdditive(clip);
          if (clip.name.endsWith("_pose")) {
            clip = THREE.AnimationUtils.subclip(
              clip,
              clip.name,
              2,
              3,
              30
            );
          }

          const action = mixer.clipAction(clip);
          activateAction(action);
          allActions.push(action);
        }
      }

      animate();
    }
  );
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
//camera.position.set(-2, 0.5, 6);
camera.position.set(-0.1, 1, 6);

const renderer = new THREE.WebGLRenderer({ antialis: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.enableZoom = true;
controls.target.set(0, 1, 0);
controls.update();
camera.lookAt(controls.target);

      
/*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/


function activateAction(action) {
    const clip = action.getClip();
    const settings = baseActions[clip.name] || additiveActions[clip.name];
    setWeight(action, settings.weight);
    action.play();
  }

  function modifyTimeScale(speed) {
    mixer.timeScale = speed;
  }

  function prepareCrossFade(startAction, endAction, duration) {
    // if the current action is 'idle', execute the crossfade immediately;
    // else wait until the current action has finished its current loop

    if (currentBaseAction === "idle" || !startAction || !endAction) {
      executeCrossFade(startAction, endAction, duration);
    } else {
      synchronizeCrossFade(startAction, endAction, duration);
    }

    // update control colors
    if (endAction) {
      const clip = endAction.getClip();
      currentBaseAction = clip.name;
    } else {
      currentBaseAction = "None";
    }

    crossFadeControls.forEach(function (control) {
      const name = control.property;
      if (name === currentBaseAction) {
        control.setActive();
      } else {
        control.setInactive();
      }
    });
  }

  function synchronizeCrossFade(startAction, endAction, duration) {
    mixer.addEventListener("loop", onLoopFinished);

    function onLoopFinished(event) {
      if (event.action === startAction) {
        mixer.removeEventListener("loop", onLoopFinished);
        executeCrossFade(startAction, endAction, duration);
      }
    }
  }

  function executeCrossFade(startAction, endAction, duration) {
    if (endAction) {
      setWeight(endAction, 1);
      endAction.time = 0;

      if (startAction) {
        startAction.crossFadeTo(endAction, duration, true);
      } else {
        endAction.fadeIn(duration);
      }
    } else {
      startAction.fadeOut(duration);
    }
  }

  function setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
function animate() {
	requestAnimationFrame( animate );

    for (let i = 0; i !== numAnimations; ++i) {
        const action = allActions[i];
        const clip = action.getClip();
        const settings = baseActions[clip.name] || additiveActions[clip.name];
        settings.weight = action.getEffectiveWeight();
    }

    // Key Controls
    if (keyMap[87] || keyMap[119]) {
        // W key
        camera.translateZ(-moveDistante);
        keyMap[87] = false;
        keyMap[119] = false;
    }

    if (keyMap[83] || keyMap[115]) {
        // S key
        camera.translateZ(moveDistante);
        keyMap[83] = false;
        keyMap[115] = false;
      }

      if (keyMap[65] || keyMap[97]) {
        // A key
        // redirect motion by 90 degress
        camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle * 25);
        keyMap[65] = false;
        keyMap[97] = false;
    }

      if (keyMap[68] || keyMap[100]) {
        // D key
        camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle * 25);
        keyMap[68] = false;
        keyMap[100] = false;
    }

    // Corridor Lights
    if (keyMap[80] || keyMap[112]) {
        // P
        tTracker = !tTracker;
        if (tTracker) {
          const midLight = new THREE.PointLight(0x9acd32, 1, 5);
          midLight.translateX(-3.0).translateY(1.5).translateZ(0.0);
          midLight.castShadow = true;
          midLight.name = "midLight";
          scene.add(midLight);
        } else {
          scene.remove(scene.getObjectByName("midLight"));
        }
        keyMap[80] = false;
        keyMap[112] = false;
    }

      if (keyMap[81] || keyMap[113]) {
        // Q
        tTracker = !tTracker;
        if (tTracker) {
          const backLight = new THREE.PointLight(0x005eff, 1, 5);
          backLight.translateX(-3.0).translateY(1.5).translateZ(-3.0);
          backLight.castShadow = true;
          backLight.name = "backLight";
          scene.add(backLight);
        } else {
          scene.remove(scene.getObjectByName("backLight"));
        }
        keyMap[81] = false;
        keyMap[113] = false;
    }

      if (keyMap[82] || keyMap[114]) {
        // R
        tTracker = !tTracker;
        if (tTracker) {
          const frontLight = new THREE.PointLight(0xe066ff, 0.5, 5);
          frontLight.translateX(-3.0).translateY(1.0).translateZ(2.5);
          frontLight.castShadow = true;
          frontLight.name = "frontLight";
          scene.add(frontLight);
        } else {
          scene.remove(scene.getObjectByName("frontLight"));
        }
        keyMap[82] = false;
        keyMap[114] = false;
    }

    // lights around the Robot
    if (keyMap[56]) {
        // 8
        Tracker8 = !Tracker8;
        if (Tracker8) {
          const LightR = new THREE.PointLight(0x005eff, 2, 5);
          LightR.translateX(2.7).translateY(0.0).translateZ(-2.8);
          LightR.castShadow = true;
          scene.add(LightR);
          LightR.name = "LightR";
        } else {
          scene.remove(scene.getObjectByName("LightR"));
        }
        keyMap[56] = false;
    }

    if (keyMap[57]) {
        // 9
        Tracker9 = !Tracker9;
        if (Tracker9) {
          const LightR2 = new THREE.PointLight(0xffff00, 2, 5);
          LightR2.translateX(2.7).translateY(0.0).translateZ(-2.8);
          LightR2.castShadow = true;
          scene.add(LightR2);
          LightR2.name = "LightR2";
        } else {
          scene.remove(scene.getObjectByName("LightR2"));
        }
        keyMap[57] = false;
    }

    if (keyMap[85] || keyMap[117]) {
        // U key - up
        // Redirect motion by 90 degrees
        camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
        keyMap[85] = false;
        keyMap[117] = false;
    }

    if (keyMap[84] || keyMap[116]) {
        // T key - down
        // Redirect motion by 90 degrees
        camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);
        keyMap[84] = false;
        keyMap[116] = false;
    }

    // Interact with the Robot
    if (keyMap[49] || keyMap[50] || keyMap[51]) {
        // 1, 2, 3 key
        let activity;

        if (keyMap[49]) {
          console.log("1 pressed");
          activity = "idle";
        } else if (keyMap[50]) {
          console.log("2 pressed");
          activity = "walk";
        } else {
          console.log("3 pressed");
          activity = "run";
        }

        const settings = baseActions[activity];
        const currentSettings = baseActions[currentBaseAction];
        const currentAction = currentSettings ? currentSettings.action : null;
        const action = settings ? settings.action : null;

        prepareCrossFade(currentAction, action, 0.35);

        keyMap[49] = false;
        keyMap[50] = false;
        keyMap[51] = false;
    }
    // interact with the model on the stool
    if (keyMap[89] || keyMap[121]) {
        // Y key
        obj5.rotation.y += 0.1 * 1.2;
        obj3.rotation.y += 0.1 * 1.2;

        keyMap[89] = false;
        keyMap[121] = false;
      }

      if (keyMap[90] || keyMap[122]) {
        // Z key
        obj3.rotation.y -= 0.1 * 2;

        keyMap[90] = false;
        keyMap[122] = false;
      }

      if (keyMap[88] || keyMap[120]) {
        // X
        xTracker = !xTracker;
        if (xTracker) {
          const dLight = new THREE.PointLight(0xfff00, 2, 2);
          dLight.translateX(0).translateY(0).translateZ(4.0);
          dLight.castShadow = true;
          dLight.name = "dLight";
          scene.add(dLight);
        } else {
          scene.remove(scene.getObjectByName("dLight"));
        }
        keyMap[88] = false;
        keyMap[120] = false;
      }


    function keyPress(event) {
        keyMap[event.keyCode] = true;
    }

    window.addEventListener("keypress", keyPress);

    // Get the time elapsed since the last frame, used for mixer update
    const mixerUpdateDelta = clock.getDelta();

    mixer.update(mixerUpdateDelta);
	renderer.render( scene, camera );
}

animate();

