/**
 * Comunicación remota para obtener y guardar un mapa
 */
remote = {
    setUrlMap: function(url){
        urlRemoteMap = url;
    },
    getUrlMap: function(){
        return urlRemoteMap;
    },
    setUrlSave: function(url){
        urlSaveRemoteMap = url;
    },
    getUrlSave: function(){
        return urlSaveRemoteMap;
    },
    getMap: function(){
        if (remote.getUrlMap() !== "") {
            _$http({
                url: remote.getUrlMap(),
                method: 'GET',
            })
            .success(function(data, status){
                angular.forEach(data[0].mapaJson.nodes._data, function(n){
                    _node.add(n);
                });
                angular.forEach(data[0].mapaJson.edges._data, function(e){
                    _edge.add(e);
                });
                setAnimacion(false);
                restorePositions();
                _network.fit();
            })
            .error(function(data){
                console.log('No se encontro un mapa');
            })
            ;
        }
    },
    saveMap: function(){
        if (remote.getUrlSave() !== "") {
            return _$http({
                url: remote.getUrlSave(),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: _data
            });
        }else{
            console.log('No se establecio la Url para guardar el mapa');
        }
    }
};