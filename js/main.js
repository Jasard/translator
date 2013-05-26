$(function(){
  // Model defined with two fields.
  var Translation = Backbone.Model.extend({
   defaults: {
     english: 'blank',
     spanish: 'blank'
   }
 });

  // Collection defined with localStorage.
  var Dictionary = Backbone.Collection.extend({
    model: Translation,
    localStorage: new Store("dictionary-store")
  });

  // Initialize Dictionary.
  var Translations = new Dictionary;

  // The AppView.
  var AppView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click #add-tran': 'insertItem', // Listen to when Add button is pressed.
      'click #get-tran': 'getItem', // Listen to when Add button is pressed.
      'click #get-alert .close': 'closeGetAlert',
      'change #edit-select': 'selectorChange'
    },

   initialize: function () {
      Translations.fetch();
      Translations.toJSON(); // Fetch collection and put in to JSON format.

      Translations.each( function( obj ){
        $('#edit-select').append($('<option>', {
          value: obj.get('english'),
          text : obj.get('english') + ' > ' + obj.get('spanish')
        }));
      });
    },

    insertItem: function (e) {
      var newEnglish = $('#input-add-english').val();
      var newSpanish = $('#input-add-spanish').val();
      // Create new Translation object and add to collection.
      newTranslation = new Translation({
        english: newEnglish,
        spanish: newSpanish
      });
      this.collection.add(newTranslation);
      newTranslation.save();
      $('#input-add-english').val('');
      $('#input-add-spanish').val('');
      $('#edit-select').append($('<option>', {
        value: newEnglish,
        text : newEnglish
      }));
    },

    getItem: function() {
      var searchEnglish = $('#input-get-english').val();
      var search = Translations.find(function(model) { return model.get('english') == searchEnglish; });
      $('#input-get-spanish').val(search.get('spanish'));
      $("#get-alert").removeClass("hidden");
      $("#get-alert").fadeIn();
      $("#get-alert").addClass("in");
      console.log(search.get('id'));
    },

    closeGetAlert: function() {
      $("#get-alert").removeClass("in");
      $("#get-alert").addClass("hidden");
    },

    selectorChange: function() {
      alert("test");
    }
  });

  // Initialize AppView.
  var App = new AppView({
    collection: Translations
  });
});
