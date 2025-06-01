import React from "react";
import Button from "./Button";

function Navbar() {
  return (
    <div className="max-w-screen-xl flex border-b-[1px] border-zinc-700 items-center justify-between mx-auto py-1">
      <div className="nleft flex items-center">
        <img
        className="h-16"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACjCAMAAAA3vsLfAAAA/1BMVEUcHBz///8AAAAaGhr8/PwcGyB1UPgeHh4bHRqysrIYGBju7u7MzMwSEhIWFhbh4eF1Tv6jo6N2VvF2VfkYGgY8L3DCwsIrIkT29vY+L2t4VvUPDw81NTWpqamHh4c8LnNZWVkcHRZQUFC7u7s/Pz9/f38XGA0oKChmZmbd3d1GRkaQkJDo6OhSPKJENH7R0dEbHhMcGiUtLS1wcHAYGQB1TP8cGSxsbGyOjo4bEkksH0waExkyJmRvWc15W99VPp0cEC8bIABvT9c2KHJeSLIcGDR7Wu1WQ5gfFjw7LH82KltgS65fP9JQOKJSObMcEzwUDyUhHS5ZRpQwJlEWER6Hxu+hAAANY0lEQVR4nO2bC1fbxhLH5ZXklS0kP+M6FiaWjbGNXWyDSWgC3IQGUtqbNr3N9/8sd596oQPWXEjJ7fzPCcHWSlr9NDs7M7sYBqq46N/dge9TiA0kxAYSYgMJsYGE2EBCbCAhNpAQG0iIDSTEBhJiAwmxgYTYQEJsICE2kBAbSIgNJMQGEmIDCbGBhNhAQmwgITaQEBtIiA0kxAYSYgMJsYGE2EBCbCAhNpAQG0iIDSTEBhJiAwmxgYTYQEJsICE2kBAbSIgNJMQGEmIDCbGBhNhAQmwgITaQEBtIiA0kxAYSYgMJsYG0PTbbDsPQcPIOOSE7/Ghd+h5UxNpChi5X67X478k6+fy0PTbHEdTCHDlGuFqFuYb4f6oC2Bi11Wrl5Ikd5ib3dN18biqEzWm3bbuaI4dDc/5B5rY9ttCxnZX908tcvXjx9l07fMJ+PjNtj23l2GH1/KLZu6tms9W7/Nf7x+6b6Xv+di2/eRhVYJCu7Q/XV+V81Xvl1suDx+yVR8hkODh8mJspTvjG4AoMUjvc/NzqletCaWj101a5/tuWprFNrzwyqLilUqlPHmgYEK7AfLRbb6ciU0J48HMv39h6LYbt49dHmxO84x3GrGQ9iC0YV7j2yLO1NmNtr64v6nkqN8un5ZsXWWsjaQVVk251P1qd1BgyawtrIxWOt9R5oNmjqwi29ar99rKZo1azVb789C4zkwaNnU6synx6TLztukQ6itr/AzaWdjr2Ly9f3dUt+/fXeyONzSTLUlrdzpBsc8PqfnTK94/NZiHIem1UZV6QinbNzaYaGtksgSj/FP8sWX2yhfMmc9l6Od0/rj7Q9NljWxtthydQObnV2gjXzodMEcQU2KwYmfi587C9Ucm75JLAf6jx88dmhOFr+0ObUTLvYFuz6KRN87ClZfG58cFbkploPNqCxfeAzXkdfvjyyw/5uvZX6fhDY1s2uPo7XcnNGiYn3KqKuxLf+QGpiRMbxPOSc4gn23rJYZ7F5inx64hfEheuRod0Dz1y94rbqVCZ0nF+ucibSZvNcuvq1s7H1tDxR0eO04oyN5EJHE/nldGof3JIAhWcmIeD4UKcWBkOBpoxNYk3HPdHnf7ewCdxIJPB5g2kpgb1D8Vv+5FzNHfFF0PJjaUV7Ip7/dGosjeobjVTAbGtw831x3Je3Nbrsdjt8te0+46xidtQX409V84KJvti2Onq0TsbE4/3hZKRGMtKNcWDkHlNf+k2JkTfKoXNJH3VhN1T3T2eismZur187oBdUd9l0dguNIJgC217c86ygRyxL1n68PF1ytxS2Dg3sic7eSyzSM+viIlC05gdEhGzjZLOcCaYV8mJK2Basrk119xS2MhYzT0VZo/s7lYqzVC3d6VlBfuLaLLi4A6DJ8T2KkGNGVhL51osT6jfi030dCC7KNNzfzKLqEka1hvCB+NIPY4lsbEBaUgrUjYoGnf8ahYbDYbyMuwTFSFzxtqS2Px9N7qWuJV76BUZqAWa2nb7RYytx5N6Xf5g+OrNo3ep5mlrM7jjkTQENt+blRLYRP+7zO/QCJsapKamFoeAnF9HDvUYGxvzrsQwExNMhE170hgbN99l8j3ws2qFJmMotnrvhmVULalmr9y6+e1rNkvIYNODdGLGz8vsqdKoLBU/7vZI313Ix3HdhcvCPD32+De1mqsJyssmrI3fjhNYTDxeRroPm3yD7C61xnjcd+X7GBcZpmBrK//786cfP/8o9Pn33z/f/hHeh41GUexC9Hsox5P7Rsyyw1nMwowDkCBgsYFJu/K5am8mhNCTmrROSxhtjI00lNEeBqL4di821pjfbsnm94BMZuLyO0XMDYrtpnn1tr05kGpvNpsDZ50f7rJZij0+i7kaklRfezD2mN39gMcCNAhk/uoaJj9Yi3kz396QBtbxeVXNDAIVRYtoOMJGTpRFDhSn+7HJg3PmBE0ayBS4+y2srV5vXZw7bbngx9JV22nb+cnVaDBlOpnPJLXuLsuYTGqJYbknPD7rhH8sszAxUpLYaDVwlZFWVWfJQpxrsQvF2Pa5pbFvxzoJude3qemaZ8iU+YVGv9+v9CcFol4otlMWdTB743mozZP863U7NydNuHfheUpnYhyeyM/E96s++2eaKl6okAw201fz70kUkgZTca5AHGFbSAc/J/qR7re2ubx/gxeGTVUYLJIrFMdWb5Xrp00W45brV+cbO1w5Nl8MvLPN4U5OKqjJgEANvOXxvtZuRWBbZrEZgSyHWLHnMY2FwMYRK2yjkTTlStzqHmzMuIfqfXZHJ8csuzKKpleFsfHQ9vebUzFMm1fnVcd2nNx15RxsJXdPhfOjjCHqD7XsINXRxyxhDMIyuQ+nGltX2lqHxInKvdYWTeT8rFlj6BUtBRTH1qr3Xhy16rwOzuztJ9u2ndwF0iQ2GZzNzibaX+8kWSV+XVTNLDbphnbiwgn3TJzSLMJmSUteJosE9/o2FjaO9AjgZlo7I8XWjwpjq7Px+SK4Zel7/ZSN18u3oe2s7sPWGY/Vs+1pr65iEStlbhIbzw3zsCVKQ5RUpJXE1iYenp1g6sdRWUKyTsWwWZG1sYB3z02+stlxIW6FsZ02y/XbDwe3N60mn1CbF+fVMPciyQqIzGS6u1VqJp6JBSBZLYM71ibBLCNsNKpIZbGxaTR+rAhbVCxJDlJ+leDNyI3PrVGzAAuAtbXqt5vw6+1Nk4/TXvnyp/z3lAh3g7HMAkby1VPtsDp0NyPxztPY5OyxSHgfflxcTRieuJAqZkx1qwhbJcY2T1ibUECM4dmOtrct6qf/C7Zeq/XKf73ybln2XmcDtXz168Yx7u6bibGxZ1Ap4CCQcVog3ry1ICz+4BGIX2UhMZeogqdnUhmrlPajl8MyDDXm45l0tytdHEsRNLaRNsm4NBdhMz0egntG1Q8InctaSPdp4zaWth8dOE7bO7ph3PjHq7cHxmqVnU+TyZUufszUqzb3pRcfBsrZebtDIVFUSoW7IhDmUTN/fj6QqHL2JV5wjOK2E+nd3V1dOFMGbTHHQPmZvreIBql5PJ3yYqYn+2lKLzctkCaAsdn2l6NLNpme1pu9q3MWuGW3BaZyUv2oKgChzPykV/eF9fmCFI/8qxlshi6csXiXhfS0GpXtZunkqi+nmIWprDJQBQBVKjF5hKusjfpqRXEQyDvIzhXJ5aHYjLXdPjhqltl8ykyOxW+Gvbonla8ey1mzS31x00ClkDsTwvPVqqIqV11S2PSYtKy5KP1P+ipWEcaRSOVVTqIDPH9fLl6U+lTkAGdq4pZZgrSvZcBnoIB8S2ujofHlqNnsMW7l8sUPvnEfNpWQSxct0vWZtA63/2Y4aLiqciSMLT1IDblGL5541GioMrqlChYxNn+ykON0pMKQKGx0R/N5ZVFSAY/IEoSfYx9nvAAzkNnyN/FtBkvg1w6LQ3pNURBheX2mebbe5koyQ088lbff1VN/SYGIAoi0tQkgafHBSKtpbDQ4lAVMnWF5h6k0RC/YinDXn7iKouXq4mciMXs6bDylstm8wOK3Hs8X2DhNT6Y0bW2UjGXPlzIioGRg6SBdFWzFnJuDzQhUBTvCYJUW+x5NYxPlTMlmrpzivKTzE/F9LZ5JKZl2ZRnFiqxwUiTeLbCWsLbDlz2+AZBh49vpHYc6K5/FIXW+mFC++jOTLGSsTdZ7LG1SlMh1vajzpTPu8/OwGcHuLKbGfy6PVeU/uZYQFc/5LSg390Zc+GZxmc4SxGohGehFM3nUHQZF1vwKbEL906i+FMWP1tFGBRvUab87uhFrMOXyp8zrUltn9NPrIKSryw1B0Eh0fedQUzLvYDN8Mk4M1No4yiDT66TRZp0TyYBMo7PccXrlygiMSnx3a0SfauXK+HPTflUXa1S37ciw1rbgdsq+zmwLpMGZ2LJ3ojsUzMXn0VSFVmwYT8aj2sJ1F8vGIYlXjoJG+kRhOcFJZSaa9qckjudT2wKZy6ooqV2pAWFn1Raz0Z5JvKk4orMtFvTszjs113VrO/ND8sAWnayK7G9rr369YXZVb56vYmx08475t3Kv3vpPeuWKquqfNn79WS4jS/G9DMaEeqkNBbphesWXbzc1J+xhSZDottqEGpc5lFR+SU123PP5FyZVWxcUNdaCX4tO+CUe3KKTVYFBatjG108sM7j57TrUGQHLqqj99ZZlp/XLt7A/5zCZHr9p6qxHv2SRKYENyPD608XFpz/CCJsROuv1yv/54uLjX/4/6K8Fi2wL5Fvbvq7ff7FXenORLf70JWzb716/D1fferv236giFuLwQgfzajSMQjRhdZSaq3DNhuvjd++56h/0qI8pxAYSYgMJsYGE2EBCbCAhNpAQG0iIDSTEBhJiAwmxgYTYQEJsICE2kBAbSIgNJMQGEmIDCbGBhNhAQmwgITaQEBtIiA0kxAYSYgMJsYGE2EBCbCAhNpAQG0iIDSTEBhJiAwmxgYTYQEJsICE2kBAbSIgNJMQGEmIDCbGBhNhAQmwgITaQEBtIiA0kxAYSYgMJsYGE2EBCbCAhNpAQG0iIDSTEBhJiAwmxgYTYCojG+i+a5xdfPAvRYQAAAABJRU5ErkJggg=="
        alt=""
      />
      <div className="links flex gap-14  ml-20">
        {["Home", "Work", "Culture","News"].map((elem, index) => {
          return (
            <a className="text-[.8vw]  font-['satoshi_variable'] flex items-center gap-2" key={index}>
              {index === 1 ? (
                <span style={{boxShadow:"0 0 0.45em #00ff19"}} className="inline-block w-1 h-1 rounded-full bg-green-500"></span>
              ) : null}
              {index === 3 ? (
                <span className="inline-block bg-zinc-800 h-9 mr-5 w-[2px]"></span>
              ) : null}
              {elem}
            </a>
          );
        })}
      </div>
      </div>
      <Button/>

    </div>
  );
}

export default Navbar;
