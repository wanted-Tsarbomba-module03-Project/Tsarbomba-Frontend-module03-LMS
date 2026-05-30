const userInfoRows = [
  [
    { label: "이름", key: "name" },
    { label: "닉네임", key: "nickname", fallback: "-" },
  ],
  [
    { label: "이메일", key: "email" },
    { label: "전화번호", key: "phone" },
  ],
];

// 읽기 전용 회원 정보 필드
function ReadonlyField({ label, value }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="readonly-box">{value}</div>
    </div>
  );
}

function UserInfoSection({ user }) {
  return (
    <div className="info-section">
      {/* 기본 회원 정보 */}
      {userInfoRows.map((row) => (
        <div className="row" key={row.map((field) => field.key).join("-")}>
          {row.map((field) => (
            <ReadonlyField
              key={field.key}
              label={field.label}
              value={user[field.key] || field.fallback || ""}
            />
          ))}
        </div>
      ))}

      {/* 권한 및 계정 상태 */}
      <ReadonlyField label="역할" value={user.role} />
      <ReadonlyField label="계정 상태" value={user.isLocked ? "비활성" : "활성"} />
    </div>
  );
}

export default UserInfoSection;
