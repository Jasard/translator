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
      'change #edit-select': 'selectorChange',
      'click #edit-delete': 'deleteEdit',
      'click #make-edit': 'makeEdit'
    },

   initialize: function () {
      Translations.fetch();
      Translations.toJSON(); // Fetch collection and put in to JSON format.
      this.updateSelect();
    },

    showAlert: function(el, type, msg) {
      var theElement = $(el);
      theElement.html(msg).removeClass("hidden alert-error alert-success").fadeIn().addClass("in "+type);
      setTimeout(function(){theElement.addClass("hidden").removeClass("in");}, 5000);
    },

    updateSelect: function() {
      var editSelect = $('#edit-select');
      var editFieldsInput = $('#edit-fields input');
      var editFieldsA = $('#edit-fields a');
      editSelect.empty();
      Translations.each( function( obj ){
        editSelect.append($('<option>', {
          value: obj.get('english'),
          text : obj.get('english') + ' > ' + obj.get('spanish')
        }));
      });

      editSelect.prop("selectedIndex", -1);
      editFieldsInput.val('');
      editFieldsInput.prop('disabled', true);
      editFieldsA.addClass('disabled');
    },

    insertItem: function (e) {
      var inputEnglish = $('#input-add-english'), inputSpanish = $('#input-add-spanish');
      var newEnglish = inputEnglish.val(), newSpanish = inputSpanish.val();

      var search = Translations.find(function(model) { return model.get('english') == newEnglish; });

      if (/\s/g.test(newEnglish) || /\s/g.test(newSpanish)) {
        this.showAlert("#add-alert", "alert-error", "<strong>Unsuccessful</strong> Single words only, no spaces!");
      } else if (!newEnglish || !newSpanish) {
        this.showAlert("#add-alert", "alert-error", "<strong>Unsuccessful</strong> Make sure you enter a word in each field!");
      } else if (search) {
        this.showAlert("#add-alert", "alert-error", "<strong>Unsuccessful</strong> Word already exists in dictionary.");
      } else {
        newEnglish = newEnglish.replace(/[^a-z]+/gi,'').toLowerCase();
        newSpanish = newSpanish.replace(/[^a-z]+/gi,'').toLowerCase();
        // Create new Translation object and add to collection.
        newTranslation = new Translation({
          english: newEnglish,
          spanish: newSpanish
        });
        this.collection.add(newTranslation);
        newTranslation.save();

        var editSelect = $('#edit-select');
        editSelect.append($('<option>', {
          value: newEnglish,
          text : newEnglish + ' > ' + newSpanish
        }));
        editSelect.prop("selectedIndex", -1);
        this.showAlert("#add-alert", "alert-success", "<strong>Success</strong> Translation has been added.");
      }
      inputEnglish.val('');
      inputSpanish.val('');
    },

    getItem: function() {
      var searchEnglish = $('#input-get-english').val().toLowerCase();
      searchEnglish = searchEnglish.replace(/[^a-z ]+/gi,'');
      var words = searchEnglish.split(' '
      var spanish = [];
      var noTrans = true;

      if (searchEnglish) {
        $.each(words, function(index, value) {
          var search = Translations.find(function(model) { return model.get('english') == words[index]; });
          if (search) {
            spanish.push(search.get('spanish'));
            noTrans = false;
          } else {
            spanish.push(words[index]);
          }
        });
        $('#input-get-spanish').val(spanish.join(" "));
        if (noTrans) {
          App.showAlert("#get-alert", "alert-error", "<strong>Unsuccessful</strong> No words could be translated.");
          $('#input-get-spanish').val('');
        } else {
          App.showAlert("#get-alert", "alert-success", "<strong>Success</strong> Translated to Spanish.");
        }
      } else {
        $('#input-get-spanish').val('');
        this.showAlert("#get-alert", "alert-error", "<strong>Unsuccessful</strong> Please enter an English word or phrase.");
      }
    },

    selectorChange: function() {
      var selectVal = $('#edit-select option:selected').val();
      var editModel = this.collection.findWhere({english: selectVal});
      $('#input-edit-english').val(editModel.get('english'));
      $('#input-edit-spanish').val(editModel.get('spanish'));
      $("#edit-fields input").prop('disabled', false);
      $('#edit-fields a').removeClass('disabled');
    },

    deleteEdit: function() {
      var selectVal = $('#edit-select option:selected').val();
      var editModel = this.collection.findWhere({english: selectVal});
      if (selectVal) {
        editModel.destroy();
        this.updateSelect();
        this.showAlert("#edit-alert", "alert-success", "<strong>Success</strong> Translation has been deleted.");
      }
    },

    makeEdit: function() {
      var selectVal = $('#edit-select option:selected').val();
      var editModel = this.collection.findWhere({english: selectVal});
      var editEnglish = $('#input-edit-english').val();
      var editSpanish = $('#input-edit-spanish').val();

      if (/\s/g.test(editEnglish) || /\s/g.test(editSpanish)) {
        this.showAlert("#edit-alert", "alert-error", "<strong>Unsuccessful</strong> Single words only, no spaces!");
      } else if (!editEnglish || !editSpanish) {
        this.showAlert("#edit-alert", "alert-error", "<strong>Unsuccessful</strong> Make sure you enter a word in each field!");
      } else {
        editEnglish = editEnglish.replace(/[^a-z]+/gi,'').toLowerCase();
        editSpanish = editSpanish.replace(/[^a-z]+/gi,'').toLowerCase();
        editModel.set({english: editEnglish, spanish: editSpanish});
        editModel.save();
        this.updateSelect();
        this.showAlert("#edit-alert", "alert-success", "<strong>Success</strong> Translation successfully edited.");
      }
    }
  });

  // Initialize AppView.
  var App = new AppView({
    collection: Translations
  });
});