interface SetProps {
  data: Record<string, string>;
}

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
        套装名称
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

      <Row>
        (2件) 增加<Text>1096</Text>攻击穿透
      </Row>
      <Row>
        (3件) 增加<Text>129</Text>魔法恢复速度
      </Row>

      <Row>
        (4件) 增加<Text>1206</Text>最大生命
      </Row>

      <Row>
        <span>
          (5件) 使用重击攻击造成伤害时，回复<Text>30</Text>%资源，创造出一个持续
          12 秒的区域，为区域内的友军赋予强化、虚弱效果。该效果每 3 秒触发一次。
        </span>
      </Row>

      <Row style={{ margin: 10 }}>部位：武器、轻甲、首饰、重甲(肩)、盾牌</Row>
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
