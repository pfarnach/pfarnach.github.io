(function() {

  var names;
  var namesPresent;
  var selectionDuration;
  var elapsedTime;
  var counter;
  var counterIncrementer;
  var openInJira;
  var listContainer;
  var checkboxContainer;
  var submitBtn;

  names = [
    { label: 'Eric', linkName: 'ehartford' },
    { label: 'Tal', linkName: 'tdanan' },
    { label: 'Nic L', linkName: 'nlembck' },
    { label: 'Arcy', linkName: 'adouglass' },
    { label: 'Keelan', linkName: 'kholman' },
    { label: 'Pat', linkName: 'pfarnach' },
    { label: 'Chris', linkName: 'clarson' },
    { label: 'Forest', linkName: 'ftoney' },
    { label: 'Ken', linkName: '"kbrumer%40sosacorp.com"' },
    { label: 'Shawn', linkName: '"sboles%40sosacorp.com"' },
    { label: 'Nick DY', linkName: 'ndeyoung' },
    { label: 'Randall', linkName: '"rsexton%40sosacorp.com"' },
    { label: 'Tim', linkName: 'tcornell' }
  ];

  submitBtn = document.getElementById('submit-list');
  checkboxContainer = document.getElementById('checkbox-container');
  listContainer = document.getElementById('name-container-list');

  submitBtn.addEventListener('click', getPresentNames, false);

  // set/reset variables on click
  function init() {
    var startingIndex;

    startingIndex = Math.floor(Math.random() * listContainer.children.length);  // randomly choose starting index
    listContainer.children[startingIndex].className = 'selected';

    selectionDuration = (Math.random() * 3000) + 2500;
    counterIncrementer = (Math.random() / 8) + 1.1;

    elapsedTime = 0;
    counter = 20;

    openInJira = document.getElementsByClassName('jira-checkbox')[0].checked;
  }

  // build HTML for checkboxes
  function drawCheckboxes() {

    _.each(names, function(name) {
      var checkbox = document.createElement('input');
      var label = document.createElement('span');
      var lineBreak = document.createElement('br');

      checkbox.type = 'checkbox';
      checkbox.value = name.label;
      checkbox.setAttribute('data-link-name', name.linkName);
      checkbox.checked = true;
      checkbox.className = 'name-checkboxes';

      label.innerHTML = name.label;

      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
      checkboxContainer.appendChild(lineBreak);
    });
  }

  // find who is present
  function getPresentNames() {

    // get selected names and shuffle them
    namesPresent =
      _(checkboxContainer.children)
        .filter(function(child) { return child.tagName ==='INPUT' && child.checked === true; })
        .map(function(child) {
          return {
            label: child.value,
            linkName: child.dataset.linkName
          };
        })
        .shuffle()
        .value();

    drawSelector(namesPresent);
  }

  // build HTML for selector
  function drawSelector(filteredNames) {

    var listItem;

    // make sure selector is empty
    while (listContainer.hasChildNodes()) {
      listContainer.removeChild(listContainer.lastChild);
    }

    // populate selector
    _.each(filteredNames, function(name) {
      listItem = document.createElement('li');
      listItem.innerHTML = name.label;
      listItem.setAttribute('data-link-name', name.linkName);
      listContainer.appendChild(listItem);
    });

    setTimeout(doSelection, 100);
  }

  // begins 'animation' and returns after elapsed time has passed
  function doSelection() {

    init();

    // updateselection recursively called to call nextSelection at growing intervals
    var updateSelection = function() {
      clearInterval(interval);
      elapsedTime += counter;
      if (elapsedTime >= selectionDuration) {
        findWinner();
        return;
      }
      counter *= counterIncrementer;
      nextSelection();
      interval = setInterval(updateSelection, counter);
    };

    var interval = setInterval(updateSelection, counter);
  }

  // toggles selected class based on child node's location
  function nextSelection() {

    _.each(listContainer.children, function(child, index, listContainer) {
      if (child.className === 'selected') {
        child.className = '';
        if (child.nextSibling) {
          child.nextSibling.className = 'selected';
        } else {
          listContainer[0].className = 'selected';
        }
        return false;
      }
    });
  }

  // adds special class to winner
  function findWinner(i) {

    i = i || 0;

    _.each(listContainer.children, function(child, index, listContainer) {
      if (child.className === 'selected') {
        child.className += ' winner';
        if (openInJira) {
          setTimeout(function() { window.open('https://sosacorp.atlassian.net/issues/?jql=assignee%20in%20(' + child.dataset.linkName + ')%20ORDER%20BY%20status%20ASC', '_blank') }, 1500);
        }
      }
    });
  }

  drawCheckboxes();

})();