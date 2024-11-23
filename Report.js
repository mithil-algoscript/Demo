import React, { useState } from "react";
const PdfListCheckbox = ({ pdfList }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  console.log("selectedData", selectedData);
  const dataForat = pdfList?.map((item) => {
    return {
      parent: {
        Vertical_Tab: item.Vertical_Tab,
        Vertical_Tab_Id: item.Vertical_Tab_Id,
        Vertical_Tab_Parent_Id: item.Vertical_Tab_Parent_Id,
      },
      subMenu:
        item.Tabs?.map((item) => {
          const childData = item?.Tabs?.map((item) => item.Tab);
          return {
            menuName: item.Tab || item?.Vertical_Tab,
            child: childData || null,
          };
        }) || null,
    };
  });
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const data = dataForat?.map((item) => {
        return {
          parent: {
            Vertical_Tab: item?.parent?.Vertical_Tab,
            Vertical_Tab_Id: item?.parent?.Vertical_Tab_Id,
            Vertical_Tab_Parent_Id: item?.parent?.Vertical_Tab_Parent_Id,
          },
          subMenu:
            item?.subMenu?.map((item) => {
              return {
                menuName: item.menuName,
                child: item.child,
              };
            }) || null,
        };
      });
      setSelectedData(data);
    } else {
      setSelectedData([]);
    }
  };
  const handleParent = (id, name) => {
    // console.log("name", name);
    // console.log("id", id);
    const index = selectedData?.findIndex(
      (item) => item?.parent?.Vertical_Tab_Id === id
    );
    if (index !== -1) {
    } else {
      const data = dataForat?.find(
        (item) => item?.parent?.Vertical_Tab_Id === id
      );
      console.log(data);
      setSelectedData([...selectedData, data]);
    }
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
      {dataForat?.map((main, index) => {
        const mainData = main?.parent?.Vertical_Tab_Id;
        const findId = selectedData?.find(
          (item) => item?.parent?.Vertical_Tab_Id === mainData
        );
        console.log(findId)
        return (
          <div key={index} className="main_menu_set">
            <div className="display_list_set">
              <input
                type="checkbox"
                id={main?.parent?.Vertical_Tab_Id}
                name={main?.parent?.Vertical_Tab_Id}
                // checked={selectedData?.some(
                //   (item) =>
                //     item?.parent?.Vertical_Tab_Id ===
                //     main?.parent?.Vertical_Tab_Id
                // )}
                onChange={() =>
                  handleParent(
                    main?.parent?.Vertical_Tab_Id,
                    main?.parent?.Vertical_Tab
                  )
                }
              />
              <label
                htmlFor={main?.parent?.Vertical_Tab_Id}
                className="mb-0 ms-3"
                style={{ fontSize: "12px" }}
              >
                {main?.parent?.Vertical_Tab}
              </label>
            </div>
            {main?.subMenu?.map((item, index) => {
              //   console.log("item", item);
              return (
                <div key={index} style={{ marginLeft: "20px" }}>
                  <div className="display_list_set">
                    <input
                      type="checkbox"
                      id={item?.menuName}
                      name={item?.menuName}
                      //   checked={selectedData?.some((item) =>
                      //     item?.subMenu?.some(
                      //       (item) => item?.menuName === item?.menuName
                      //     )
                      //   )}
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
                            // checked={selectedData?.some((item) =>
                            //   item?.subMenu?.some((item) =>
                            //     item?.child?.includes(child)
                            //   )
                            // )}
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
