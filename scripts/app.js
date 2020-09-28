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
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Egg', calories: 1200},
      // {id: 2, name: 'Fish and Rice', calories: 2200},
      // {id: 3, name: 'Veg Dinner', calories: 400},
      // {id: 4, name: 'Cookies', calories: 1200},
    ],
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      }else {
        ID = 0;
      }

      // Parse calories
      calories = parseFloat(calories);

      // Create a new Item
      const newItem = new Item(`item-${ID}`, name, calories); 

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    logData: function() {
      return data;
    }
    
  }


})();

// UI Controller
const UICtrl = (function() {

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
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
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItem: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
      // Unhide list item
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add id
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="fas   fa-pencil-alt"></i></a>
      `;

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    clearInputFields: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    }
  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrls) {

  // Load event listeners
  const loadEventListeners = function() {
    // Get UISelectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    e.preventDefault();
    // Get item from UI Controller
    const input = UICtrl.getItem();
    if(input.name !== '' && input.calories !== '') {
      // Insert item to the data structure / state / data store
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to the UI
      UICtrl.addListItem(newItem);
      // Clear input
      UICtrl.clearInputFields();
    }
  }
  // Public methods
  return {
    init: function() {
      console.log('Initializing App ...');

      // Fetch items from Data Structure
      const items = ItemCtrl.getItems();

      // Hide item list if there is no any item
      if(items.length === 0) {
        UICtrl.hideList();
      }else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Load event listeners
      loadEventListeners();
    }
  }
  
})(ItemCtrl, UICtrl);


App.init();