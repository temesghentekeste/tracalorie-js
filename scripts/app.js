// Storage Controller
const StorageCtrl = (function () {
  const localStorageKey = 'mealItems';
  return {
    storeItem(item) {
      let mealItems;

      if (localStorage.getItem(localStorageKey) === null) {
        mealItems = [];
        mealItems.push(item);
      } else {
        mealItems = JSON.parse(localStorage.getItem(localStorageKey));
        mealItems.push(item);
      }
      localStorage.setItem(localStorageKey, JSON.stringify(mealItems));
    },
    getItemsFromStorage() {
      let mealItems;
      if (localStorage.getItem(localStorageKey) === null) {
        mealItems = [];
      } else {
        mealItems = JSON.parse(localStorage.getItem(localStorageKey));
      }
      return mealItems;
    },
    updateItemStorage(updatedItem) {
      const mealItems = JSON.parse(localStorage.getItem(localStorageKey));

      mealItems.forEach((meal, index) => {
        if (meal.id === updatedItem.id) {
          mealItems.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem(localStorageKey, JSON.stringify(mealItems));
    },
    deleteItemFromStorage(id) {
      const mealItems = JSON.parse(localStorage.getItem(localStorageKey));
      mealItems.forEach((item, index) => {
        if (item.id === id) {
          mealItems.splice(index, 1);
        }
      });
      localStorage.setItem(localStorageKey, JSON.stringify(mealItems));
    },
    removeItemsFromStorage() {
      localStorage.removeItem(localStorageKey);
    },
  };
}());

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = parseInt(id, 10);
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods
  return {
    getItems() {
      return data.items;
    },

    addItem(name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Parse calories
      calories = parseInt(calories, 10);

      // Create a new Item
      const newItem = new Item(`${ID}`, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById(id) {
      const found = data.items.find(item => item.id === id);
      return found;
    },

    getCurrentItem() {
      return data.currentItem;
    },

    setCurrentItem(itemToEdit) {
      data.currentItem = itemToEdit;
    },

    logData() {
      return data;
    },

    getTotalCalories() {
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });
      return total;
    },

    updateItem(name, calories) {
      // Calories to number
      calories = parseInt(calories, 10);
      let found = null;
      data.items.forEach(item => {
        if (data.currentItem.id === item.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem(id) {
      // Get the ids
      const ids = data.items.map(item => item.id);

      // Get the index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    clearAllItems() {
      data.items = [];
    },

  };
}());

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  };
  // Public methods
  return {
    populateItemList(items) {
      let html = '';
      items.forEach(item => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="edit-item fas   fa-pencil-alt"></i></a>
          </li>
        `;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors() {
      return UISelectors;
    },
    getItem() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    addItemToForm() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories; // eslint-disable-line max-len
      // Show edit state
      UICtrl.showEditState();
    },

    addListItem(item) {
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
            <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
      `;

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem(item) {
      // Get all li from the list item
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Conver NodeList into Array
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id');
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
              <strong>${item.name}: </strong> <em>${item.calories}</em>
              <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
          `;
        }
      });
    },

    deleteListItem(id) {
      id = `#item-${id}`;
      const item = document.querySelector(id);
      item.remove();
    },

    clearInputFields() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotoalCalories(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState() {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      this.clearInputFields();
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    removeItems() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(listItem => listItem.remove());
    },
  };
}());

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UISelectors
    const UISelectors = UICtrl.getSelectors();

    // Add item submit
    const itemAddSubmit = function (e) {
      e.preventDefault();
      // Get item from UI Controller
      const input = UICtrl.getItem();
      if (input.name !== '' && input.calories !== '') {
      // Insert item to the data structure / state / data store
        const newItem = ItemCtrl.addItem(input.name, input.calories);

        // Add item to ls
        StorageCtrl.storeItem(newItem);
        // Add item to the UI
        UICtrl.addListItem(newItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Show total calories
        UICtrl.showTotoalCalories(totalCalories);

        // Clear input
        UICtrl.clearInputFields();
      }
    };

    // Update item click
    const itemUpdateClick = function (e) {
      e.preventDefault();

      if (e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1)
        const listId = e.target.parentNode.parentNode.id;
        // Break into an array
        const listIdArr = listId.split('-');
        const id = parseInt(listIdArr[1], 10);

        // Get item
        const itemToEdit = ItemCtrl.getItemById(id);

        // Set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        // Add item to form
        UICtrl.addItemToForm();
      }
    };
    // Item update submit
    const itemUpdateSubmit = function (e) {
      e.preventDefault();
      const item = UICtrl.getItem();

      // Update item
      const updatedItem = ItemCtrl.updateItem(item.name, item.calories);

      // Update UI
      UICtrl.updateListItem(updatedItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories
      UICtrl.showTotoalCalories(totalCalories);

      // Update local storage
      StorageCtrl.updateItemStorage(updatedItem);

      // Clear edit state
      UICtrl.clearEditState();
    };

    // Delete button submit event
    const itemDeleteSubmit = function (e) {
      e.preventDefault();

      // Get current item
      const currentItem = ItemCtrl.getCurrentItem();

      // Delete from data structure
      ItemCtrl.deleteItem(currentItem.id);

      // Delete form UI
      UICtrl.deleteListItem(currentItem.id);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories
      UICtrl.showTotoalCalories(totalCalories);

      // Delete item from ls
      StorageCtrl.deleteItemFromStorage(currentItem.id);

      // Clear edit state
      UICtrl.clearEditState();
    };

    // Back to Insert Mode
    const backToInsertMode = function (e) {
      e.preventDefault();
      UICtrl.clearEditState();
    };

    // Clear all items event
    const clearAllItemsClick = function () {
    // Clear all items from data structure
      ItemCtrl.clearAllItems();

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories
      UICtrl.showTotoalCalories(totalCalories);

      // Remove from UI
      UICtrl.removeItems();

      // Remove from ls
      StorageCtrl.removeItemsFromStorage();

      // Hide List
      UICtrl.hideList();
    };

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', e => {
      if (e.key === 13 || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateClick);

    // Edit button submit event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete button submit event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button  event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backToInsertMode);

    // Clear button  event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  };


  // Public methods
  return {
    init() {
      // Clear edit state
      UICtrl.clearEditState();

      // Fetch items from Data Structure
      const items = ItemCtrl.getItems();

      // Hide item list if there is no any item
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories
      UICtrl.showTotoalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
}(ItemCtrl, StorageCtrl, UICtrl));


App.init();