Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    "click li" : "selectPokemonFromList"
  },

  initialize: function () {
    this.collection = Pokedex.Collections.pokes;
  },

  addPokemonToList: function (pokemon) {
    var content = JST['pokemonListItem']({ pokemon: pokemon });
    this.$el.append(content);
  },

  refreshPokemon: function (options) {
    this.collection.fetch({
      success: function() {
        this.render();
        if (options && options.callback) {
          options.callback();
        }
        
      }.bind(this) 
    })
  },

  render: function () {
    this.$el.empty();
    this.collection.each(this.addPokemonToList.bind(this));
  },

  selectPokemonFromList: function (event) {
    var id = $(event.currentTarget).data("id");
    Backbone.history.navigate("pokemon/" + id, { trigger: true });
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    "click .toys li": "selectToyFromList" 
  },
  initialize : function() {
    this.listenTo(this.model.toys(), "remove", this.render);
  },
  refreshPokemon: function (options) {
    this.model.fetch({
      success: (function() {
        this.render();
        if (options && options.callback){
          
          options.callback();
        }
      }).bind(this)
    });
  },

  render: function () {
    this.$el.empty();
    var rendered = JST['pokemonDetail']({pokemon: this.model});
    this.$el.html(rendered);
    this.model.toys().each(function (toy) {
      var rendered = JST['toyListItem']({toy: toy});
      this.$el.find(".toys").append(rendered);
    }.bind(this));
  },

  selectToyFromList: function (event) {
    var toyId = $(event.currentTarget).data("id");
    var pokemonId = $(event.currentTarget).data("pokemon-id");
    Backbone.history.navigate(
      "pokemon/" + pokemonId + "/toys/" + toyId, 
      { trigger: true }
    );
  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  events: {
    "change select" : "reassignToy"
  },
  reassignToy: function(event){
    var $currentTarget = $(event.currentTarget);
    var pokemon = Pokedex.Collections.pokes.get($currentTarget.data("pokemon-id"));
    var toy = pokemon.toys().get($currentTarget.data("toy-id"));
    
    Backbone.history.navigate("pokemon/" + this.model.get("pokemon_id"), { trigger: true });
    this.$el.empty();
    
    toy.set("pokemon_id", $currentTarget.val());
    toy.save({}, {
      success: (function () { pokemon.toys().remove(toy); }) 
    });
  },
  render: function () {
    var rendered = JST['toyDetail']({toy: this.model, pokes: Pokedex.Collections.pokes});
    this.$el.html(rendered);
  },
  redirectToParent: function(){
    
  }
});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
    "submit form" : "savePokemon"
  },
  render: function () {
    var rendered = JST['newPokemonForm']({types: Pokedex.Models.Pokemon.TYPES});
    this.$el.html(rendered);
    return this;
  },
  savePokemon: function(event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();
    this.model.save(data.pokemon,{
      success: function () {
        this.collection.push(this.model);
        Backbone.history.navigate("pokemon/" + this.model.id, {trigger: true});
      }.bind(this)
    });
  }
});

