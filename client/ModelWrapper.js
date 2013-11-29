
ModelWrapper = function (model) {
	
    model.getMeshFromModel = this.getMeshFromModel;
    model.getMesh = function () {
        return this.getMeshFromModel(this);
    };

    model.getBoundingBox = function () {                                                                       
        var boundingBox = new THREE.Box3(); 
        boundingBox.setFromObject(this);
        this.modelBoundingBox = boundingBox;                                                                    //set property to not re-compute when getting bounding mesh (might introduce bugs?)
        return boundingBox;                                                             
    }

    model.getBoundingMesh = function(widthSegments, heightSegments, depthSegments) {
        if(this.modelBoundingBox == undefined)
            this.getBoundingBox();                                                            
        
        // console.log(boundingBox);
        //var mesh = buildBoundingMeshFromBox(boundingBox, widthSegments, heightSegments, depthSegments);
        var boundingBox = this.modelBoundingBox;
        var width = boundingBox.max.x - boundingBox.min.x;
        var height = boundingBox.max.y - boundingBox.min.y;
        var depth = boundingBox.max.z - boundingBox.min.z;
        var bbSize = this.modelBoundingBox.size();
        console.log(bbSize.x + " - " + bbSize.y + " - " + bbSize.z);
        console.log(width + " - " + height + " - " + depth);
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
        clone.modelBoundingBox = this.modelBoundingBox;
        clone.modelBoundingMesh = this.modelBoundingMesh;

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

