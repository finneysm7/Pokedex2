Pokedex.Router = Backbone.Router.extend({
  routes: {
    "" : "pokemonIndex",
    "pokemon/:id": "pokemonDetail",
    "pokemon/:pokemonId/toys/:toyId" : "toyDetail"
  },

  pokemonDetail: function (id, callback) {
    if (!this._pokemonIndex){
      this.pokemonIndex(this.pokemonDetail.bind(this, id, callback));
    } else {
      this._pokemonDetail = new Pokedex.Views.PokemonDetail({
        model: this._pokemonIndex.collection.get(+id)
      });
      
      $("#pokedex .pokemon-detail").html(this._pokemonDetail.$el);
      this._pokemonDetail.refreshPokemon({callback: callback});
    }
  },

  pokemonIndex: function (callback) {
    this._pokemonIndex = new Pokedex.Views.PokemonIndex();
    this._pokemonIndex.refreshPokemon({callback: callback});
    $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
    this.pokemonForm();
  },

  toyDetail: function (pokemonId, toyId) {
    if (!this._pokemonDetail){
      this.pokemonDetail(pokemonId, this.toyDetail.bind(this, pokemonId, toyId));
    } else {
      var toy = this._pokemonDetail.model.toys().get(+toyId);
      var toyDetail = new Pokedex.Views.ToyDetail({model: toy});
      $("#pokedex .toy-detail").html(toyDetail.$el);
      toyDetail.render();
    }
  },
  pokemonForm: function(){
    this._pokemonForm = new Pokedex.Views.PokemonForm({
      model: new Pokedex.Models.Pokemon(),
      collection: Pokedex.Collections.pokes
    });
    
    $('#pokedex .new-pokemon').html( this._pokemonForm.render().$el );
  }
});

$(function () {
  Pokedex.Collections.pokes = new Pokedex.Collections.Pokemon();
  new Pokedex.Router();
  Backbone.history.start();
});