$(function () {
  window.JST = {};

  JST["pokemonDetail"] =
    _.template($("#pokemon-detail-template").html());

  JST["pokemonListItem"] =
    _.template($("#pokemon-list-item-template").html());

  JST["toyListItem"] =
    _.template($("#toy-list-item-template").html());

  JST["toyDetail"] =
    _.template($("#toy-detail-template").html());
    
  JST["newPokemonForm"] =
    _.template($("#new-pokemon-form-template").html());
});
