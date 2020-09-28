// Storage Controller


// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 0, name: 'Egg', calories: 1200},
      {id: 0, name: 'Fish and Rice', calories: 2200},
      {id: 0, name: 'Veg Dinner', calories: 400},
      {id: 0, name: 'Cookies', calories: 1200},
    ],
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    logData: function() {
      return data;
    }
  }


})();

// UI Controller
const UICtrl = (function() {
  // Public methods
  return {

  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrls) {

  // Public methods
  return {
    init: function() {
      console.log('Initializing App ...')
    }
  }
  
})(ItemCtrl, UICtrl);


App.init();