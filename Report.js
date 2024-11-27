import React, { useEffect, useState } from "react";
const PdfListCheckbox = ({ pdfList, handleData }) => {
  console.log("pdfList", pdfList);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [formatData, setFormatData] = useState("");
  console.log(formatData);
  useEffect(() => {
    function formatMenu(data) {
      return data
        .map((tab) => {
          if (!tab.subMenu) return "";

          return tab.subMenu
            .map((menu) => {
              const basePath = `${tab.Vertical_Tab}~${menu.menuName}`;

              if (menu.child && Array.isArray(menu.child)) {
                return `${basePath}~${menu.child.join("^")}`;
              }

              return basePath;
            })
            .join("|");
        })
        .filter((path) => path !== "")
        .join("|");
    }

    const result = formatMenu(selectedData);
    handleData(result);
    setFormatData(result);
  }, [selectedData]);
  const dataFormat = pdfList?.map((item) => {
    return {
      Vertical_Tab_Id: item.Vertical_Tab_Id,
      Vertical_Tab: item.Vertical_Tab,
      subMenu:
        item.Tabs?.map((items) => {
          const childData = items?.Tabs?.map((i) => i.Tab);
          return {
            menuName: items.Tab || items?.Vertical_Tab,
            child: childData || null,
            Vertical_Tab_Id: item.Vertical_Tab_Id,
          };
        }) || null,
    };
  });
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const data = dataFormat?.map((item) => {
        return {
          Vertical_Tab_Id: item.Vertical_Tab_Id,
          Vertical_Tab: item?.Vertical_Tab,
          subMenu:
            item?.subMenu?.map((item) => {
              return {
                menuName: item.menuName,
                child: item.child,
                Vertical_Tab_Id: item.Vertical_Tab_Id,
              };
            }) || null,
        };
      });
      setSelectedData(data);
    } else {
      setSelectedData([]);
    }
  };
  const handleParent = (id) => {
    const dataChacked = selectedData
      ? selectedData?.find((item) => item.Vertical_Tab_Id === id)
        ? true
        : false
      : false;
    if (dataChacked) {
      const data = selectedData?.filter((item) => item.Vertical_Tab_Id !== id);
      setSelectedData(data);
    } else {
      const dataGet = dataFormat?.find((item) => item.Vertical_Tab_Id === id);
      setSelectedData([...selectedData, dataGet]);
    }
  };
  const handleSubmenu = (data) => {
    setSelectedData((prevSelectedData) => {
      const dataChacked = prevSelectedData.find(
        (item) => item.Vertical_Tab_Id === data.Vertical_Tab_Id
      );

      if (dataChacked) {
        const getDatas = dataChacked.subMenu.find(
          (i) => i.menuName === data.menuName
        );

        let updatedSubMenu;
        if (getDatas) {
          updatedSubMenu = dataChacked.subMenu.filter(
            (item) => item.menuName !== data.menuName
          );
          setSelectAll(false);
        } else {
          updatedSubMenu = [...dataChacked.subMenu, data];
        }

        const updatedDataChacked = {
          ...dataChacked,
          subMenu: updatedSubMenu,
        };

        if (updatedSubMenu.length === 0) {
          return prevSelectedData.filter(
            (item) => item.Vertical_Tab_Id !== data.Vertical_Tab_Id
          );
        }

        return prevSelectedData.map((item) =>
          item.Vertical_Tab_Id === dataChacked.Vertical_Tab_Id
            ? updatedDataChacked
            : item
        );
      } else {
        const datas = dataFormat.find(
          (item) => item.Vertical_Tab_Id === data.Vertical_Tab_Id
        );

        if (
          !prevSelectedData.find(
            (item) => item.Vertical_Tab_Id === data.Vertical_Tab_Id
          )
        ) {
          return [
            ...prevSelectedData,
            {
              ...datas,
              subMenu: [data],
            },
          ];
        }
      }

      return prevSelectedData || [];
    });
  };
  const handleChild = (childData, parentData, main) => {
    setSelectedData((prevSelectedData) => {
      const findData = prevSelectedData.find(
        (item) => item.Vertical_Tab_Id === parentData.Vertical_Tab_Id
      );

      if (findData) {
        const findParent = findData?.subMenu.find(
          (i) => i.menuName === parentData?.menuName
        );

        if (findParent) {
          const findChild = findParent.child?.includes(childData);

          const updatedChildList = findChild
            ? findParent.child.filter((item) => item !== childData)
            : [...(findParent.child || []), childData];

          const updatedSubMenu = findData.subMenu.map((sub) => {
            if (sub.menuName === parentData.menuName) {
              return {
                ...sub,
                child: updatedChildList,
              };
            }
            return sub;
          });

          return prevSelectedData.map((item) => {
            if (item.Vertical_Tab_Id === findData.Vertical_Tab_Id) {
              return {
                ...item,
                subMenu: updatedSubMenu,
              };
            }
            return item;
          });
        } else {
          const updatedSubMenu = [...findData.subMenu, parentData];
          return prevSelectedData.map((item) => {
            if (item.Vertical_Tab_Id === findData.Vertical_Tab_Id) {
              return {
                ...item,
                subMenu: updatedSubMenu,
              };
            }
            return item;
          });
        }
      } else {
        const dataFind = dataFormat?.find(
          (item) => item.Vertical_Tab_Id === parentData.Vertical_Tab_Id
        );

        if (dataFind) {
          const dataParent = dataFind?.subMenu.find(
            (item) => item?.menuName === parentData?.menuName
          );

          const newMainData = {
            ...main,
            subMenu: [
              {
                ...dataParent,
                child: [childData],
              },
            ],
          };

          return [...prevSelectedData, newMainData];
        }
      }

      return prevSelectedData;
    });
  };
  return (
    <>
      <div
        className="d-flex align-items-center bg-light"
        style={{ borderBottom: ".5px solid #ececec", padding: "5px 0" }}
      >
        <input
          id="selectAll"
          value={selectAll}
          onChange={handleSelectAll}
          checked={selectedData?.length === dataFormat?.length}
          type="checkbox"
          name="selectAll"
        />
        <label
          htmlFor="selectAll"
          className="mb-0 ms-3"
          style={{ fontSize: "12px" }}
        >
          Select all
        </label>
      </div>
      {dataFormat?.map((main, index) => {
        const mainData = main?.Vertical_Tab_Id;
        const findData =
          selectedData &&
          selectedData?.find((item) => item?.Vertical_Tab_Id === mainData);
        const isParentChecked = findData
          ? findData?.subMenu?.length === main?.subMenu?.length
          : false;
        return (
          <div key={index} className="main_menu_set">
            <div className="display_list_set">
              <input
                type="checkbox"
                id={main?.Vertical_Tab_Id}
                name={main?.Vertical_Tab_Id}
                checked={isParentChecked}
                onChange={() => handleParent(main?.Vertical_Tab_Id)}
              />
              <label
                htmlFor={main?.parent?.Vertical_Tab_Id}
                className="mb-0 ms-3"
                style={{ fontSize: "12px" }}
              >
                {main?.Vertical_Tab}
              </label>
            </div>
            {main?.subMenu?.map((item, index) => {
              const findSubmenuData =
                findData?.subMenu &&
                findData?.subMenu?.find((i) => i.menuName === item.menuName);
              const isSubMenuChecked = findData?.subMenu?.find(
                (i) => i.menuName === item.menuName
              )
                ? true
                : false;
              return (
                <div key={index} style={{ marginLeft: "20px" }}>
                  <div className="display_list_set">
                    <input
                      type="checkbox"
                      id={item?.menuName}
                      name={item?.menuName}
                      checked={isSubMenuChecked}
                      onChange={() => handleSubmenu(item)}
                    />
                    <label
                      htmlFor={item?.menuName}
                      className="mb-0 ms-3"
                      style={{ fontSize: "12px" }}
                    >
                      {item?.menuName}
                    </label>
                  </div>
                  <div>
                    {item?.child?.map((child, index) => {
                      const isChildChecked = findSubmenuData?.child.find(
                        (i) => i === child
                      )
                        ? true
                        : false;
                      return (
                        <div
                          key={index}
                          className="display_list_set"
                          style={{ marginLeft: "20px" }}
                        >
                          <input
                            type="checkbox"
                            id={child}
                            name={child}
                            checked={isChildChecked}
                            onChange={() => handleChild(child, item, main)}
                          />
                          <label
                            htmlFor={child}
                            className="mb-0 ms-3"
                            style={{ fontSize: "12px" }}
                          >
                            {child}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default PdfListCheckbox;
