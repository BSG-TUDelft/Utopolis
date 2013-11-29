
ModelWrapper = function (model) {
	
    model.getMeshFromModel = this.getMeshFromModel;
    model.getMesh = function () {
        return this.getMeshFromModel(this);
    };

    model.getBoundingBox = function () {                                                                       
        var boundingBox = new THREE.Box3(); 
        boundingBox.setFromObject(this);
        this.modelBoundingBox = boundingBox;                                                       //set property to avoid needing to re-compute when getting bounding mesh (might introduce bugs?)
        return boundingBox;                                                             
    }

    model.getBoundingMesh = function (widthSegments, heightSegments, depthSegments) {
        if(this.modelBoundingBox == undefined)
            this.getBoundingBox();                                                            
        
        // console.log(boundingBox);
        //var mesh = buildBoundingMeshFromBox(boundingBox, widthSegments, heightSegments, depthSegments);
        var bbSize = this.modelBoundingBox.size();
        var bbGeometry = new THREE.CubeGeometry( bbSize.x, bbSize.y, bbSize.z, widthSegments, heightSegments, depthSegments );
        var bbMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true} );
        var boundingMesh = new THREE.Mesh( bbGeometry, bbMaterial );
        boundingMesh.visible = false;

        boundingMesh.boundingBox = this.modelBoundingBox;
        
        model.modelBoundingMesh = boundingMesh;
        return boundingMesh;
    }

    model.getClone = function () {
		var clone = this.clone();
          
        clone.material = this.material;
        clone.getMesh = this.getMesh;
        clone.getMeshFromModel = this.getMeshFromModel;
        clone.getBoundingBox = this.getBoundingBox;
        clone.getBoundingMesh = this.getBoundingMesh;
        
        if(this.modelBoundingBox)
            clone.modelBoundingBox = this.modelBoundingBox;
        else
            clone.modelBoundingBox = null;
        if(this.modelBoundingMesh)
            clone.modelBoundingMesh = this.modelBoundingMesh;
        else
            clone.modelBoundingMesh = null;
        return clone;
	};


    model.showBoundingBox = function () {                                                //debugging
        var modelBoundingBox = this.modelBoundingBox;
        var pointGeometry = new THREE.CubeGeometry( 0.3, 0.3, 0.3);
        var pointMinMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000} );
        var pointMinMesh = new THREE.Mesh( pointGeometry, pointMinMaterial );
        pointMinMesh.position.x = modelBoundingBox.min.x;
        pointMinMesh.position.y = modelBoundingBox.min.y;
        pointMinMesh.position.z = modelBoundingBox.min.z;
        //console.log(pointMinMesh.position);
        scene.add(pointMinMesh);
        //console.log(pointMinMesh.position);

        var pointMaxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
        var pointMaxMesh = new THREE.Mesh( pointGeometry, pointMaxMaterial );
        pointMaxMesh.position.x = modelBoundingBox.max.x;
        pointMaxMesh.position.y = modelBoundingBox.max.y;
        pointMaxMesh.position.z = modelBoundingBox.max.z;
        scene.add(pointMaxMesh);
    };

    /*model.showEmitter = function () {                                                   //collision debugging
        if (collider) {
            var originPoint = collider.position.clone();
            if(pointMesh == null){   
                //console.log("point");
                var pointGeometry = new THREE.CubeGeometry( 0.3, 0.3, 0.3);
                var pointMaterial = new THREE.MeshBasicMaterial( { color: 0x000000} );
                pointMesh = new THREE.Mesh( pointGeometry, pointMaterial );
                scene.add(pointMesh);
            }
            if(pointMesh)
            {
                pointMesh.position.x = originPoint.x;
                pointMesh.position.y = originPoint.y;
                pointMesh.position.z = originPoint.z;
            }
        }
        else {
            scene.remove(pointMesh);
            pointMesh = null;
        }
    }*/

    /*function printEmitterOfModel (collider) {                       //keep for collision debugging
        if(collider) { 
            var originPoint = collider.position.clone();
            console.log(originPoint)
        }
    }*/
	
    return model;
}

ModelWrapper.prototype.getMeshFromModel = function (model) {
    if(model instanceof THREE.Mesh){
        return model;
    }
    if(model.children) {
        for(var i = 0; i < model.children.length; i++) {
            var child = model.children[i];
            var mesh = this.getMeshFromModel(child);
            if(mesh instanceof THREE.Mesh)
                return mesh;
        }
        return null;
    }
    return null;
}

