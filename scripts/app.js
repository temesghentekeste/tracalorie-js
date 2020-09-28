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
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    }
  }


})();

// UI Controller
const UICtrl = (function() {

  const UISelectors = {
    itemList: '#item-list'
  }
  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(item => {
        html += `
          <li class="edit-item collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="fas   fa-pencil-alt"></i></a>
          </li>
        `
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;

    }
  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrls) {

  // Public methods
  return {
    init: function() {
      console.log('Initializing App ...');

      // Fetch items from Data Structure
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemList(items);
    }
  }
  
})(ItemCtrl, UICtrl);


App.init();