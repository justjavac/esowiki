// TODO: 类型定义重复了
interface SetProps {
  data: {
    name: string;
    type: string;
    itemCount: number;
    setBonusCount: number;
    setMaxEquipCount: number;
    gameId: number;
    setBonusDesc1: string;
    setBonusDesc2: string;
    setBonusDesc3: string;
    setBonusDesc4: string;
    setBonusDesc5: string;
    setBonusDesc6: string;
    setBonusDesc7: string;
    itemSlots: string;
  };
}

type Key = keyof SetProps["data"];

export function Set({ data }: SetProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexWrap: "nowrap",
        wordBreak: "break-all",
        fontFamily: "EsoFontStyle, Arial, sans-serif",
        fontSize: 14,
        marginTop: 32,
        marginBottom: 5,
        width: 394,
        height: 280,
        backgroundImage:
          "url(https://esoitem.uesp.net/resources/eso_item_border.png)",
        backgroundRepeat: "repeat-y",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          marginTop: -32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          style={{
            display: "flex",
            height: 64,
            width: 64,
          }}
          src="https://esoicons.uesp.net/esoui/art/icons/gear_breton_heavy_head_d.png"
          width="64"
          height="64"
          alt=""
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 18,
          color: "#EECA2A",
          textAlign: "center",
        }}
      >
        {data.name}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 14,
          color: "#EECA2A",
          textAlign: "center",
        }}
      >
        English name
      </div>

      <img
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: 339,
          height: 3,
          marginTop: 5,
          marginBottom: 10,
        }}
        src="https://esolog.uesp.net/resources/eso_item_hr.png"
        width="339"
        height="3"
        alt=""
      />

      {Array(7)
        .fill(0)
        .map(function (_, i) {
          if (!Object.hasOwn(data, `setBonusDesc${i + 1}`)) return null;
          return <Row>{data[`setBonusDesc${i + 1}` as Key]}</Row>;
        })}

      <Row style={{ margin: 10 }}>部位：{data.itemSlots}</Row>
    </div>
  );
}

function Row({ children, style = {} }: any) {
  return (
    <div
      style={{
        display: "flex",
        padding: "0 10%",
        lineHeight: 1.5,
        color: "#C5C29E",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Text({ children }: any) {
  return (
    <span
      style={{
        color: "#FFF",
      }}
    >
      {children}
    </span>
  );
}
