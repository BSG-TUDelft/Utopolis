
ModelWrapper = function (model) {
	
    model.getMeshFromModel = this.getMeshFromModel;
    model.getMesh = function () {
        return this.getMeshFromModel(this);
    };

    model.getboundingBox = function () {                                                                       
        var boundingBox = new THREE.Box3(); 
        boundingBox.setFromObject(this);
        this.modelBoundingBox = boundingBox;                                                                    //set property to not re-compute when getting bounding mesh (might introduce bugs?)
        return boundingBox;                                                             
    }

    model.getBoundingMesh = function(widthSegments, heightSegments, depthSegments) {
        if(this.modelBoundingBox == undefined)
            var boundingBox = this.getboundingBox();                                                            
        
        // console.log(boundingBox);
        var mesh = buildBoundingMeshFromBox(boundingBox, widthSegments, heightSegments, depthSegments);
        mesh.boundingBox = boundingBox;
        
        model.modelBoundingMesh = mesh;
        return mesh;
    }

    model.getClone = function () {
		var clone = this.clone();
        
        clone.material = this.material;
        clone.getMesh = this.getMesh;
        clone.getMeshFromModel = this.getMeshFromModel;
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

