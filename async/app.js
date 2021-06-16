const app = async () => {
  const getData = async (API_URL) => {
    const response = await fetch(API_URL);
    const data = await response.json();

    return data;
  };

  const howManyTimesInArray = (array, value) => {
    return array.filter((v) => v === value).length;
  };

  const sortFunction = (a, b) => {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  };

  const users = await getData("http://localhost:3000/users");

  const prepData = async () => {
    let companyUserIds = [];
    users.forEach((user) => {
      const emailNumbers = user.email.match(/\d+/g);
      companyUserIds.push(emailNumbers[1]);
    });

    let howManyUsersInCompany = [];
    let tmpArray = [];
    companyUserIds.forEach((id) => {
      tmpArray.push(howManyTimesInArray(companyUserIds, id));
      tmpArray.push(id);
      howManyUsersInCompany.push(tmpArray);
      tmpArray = [];
    });

    howManyUsersInCompany.sort(sortFunction);
    return howManyUsersInCompany;
  };

  const getUserDataById = (id) => {
    let userData = [];
    let tmpArray = [];
    users.filter((user) => {
      const emailNumbers = user.email.match(/\d+/g);
      if (id === emailNumbers[1]) {
        tmpArray.push(user.name);
        tmpArray.push(user.email);
        userData.push(tmpArray);
        tmpArray = [];
      }
    });
    return userData;
  };

  const createElement = (type) => {
    return document.createElement(type);
  };

  const displayData = async () => {
    const howManyUsersInCompany = await prepData();
    const tbody = document.getElementsByTagName("tbody");

    howManyUsersInCompany.forEach((companyData) => {
      const tr = createElement("tr");
      tr.classList.add("table-element");
      const tdComp = createElement("td");
      tdComp.innerText = `Company ${companyData[1]}`;
      tr.appendChild(tdComp);

      const tdNum = createElement("td");
      tdNum.innerText = companyData[0];
      tr.appendChild(tdNum);

      tbody[0].appendChild(tr);

      const userDataSpan = createElement("span");
      userDataSpan.classList.add("hidden");
      userDataSpan.innerText = getUserDataById(companyData[1]).join("\n");
      tbody[0].appendChild(userDataSpan);
    });

    displayUsersData();
  };

  const displayUsersData = () => {
    const rows = Array.from(document.getElementsByClassName("table-element"));

    rows.forEach((row) => {
      row.addEventListener("click", () => {
        row.nextSibling.classList.toggle("hidden");
      });
    });
  };

  displayData();
};

app();
