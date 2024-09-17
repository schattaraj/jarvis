import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumb = ({ parent = "Dashboard" }) => {
  const router = useRouter();
  const pathArray = router.asPath.split('/').filter(path => path);
  //console.log("Path",pathArray[2],decodeURIComponent((pathArray[2] + '').replace(/\+/g, '%20')));

  const toNormalCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
      .replace(/[-_]/g, ' ') // Replace hyphens/underscores with space
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (
    <nav aria-label="breadcrumb">
      {
        pathArray[pathArray.length - 1] != "dashboard" &&
        <>
          <Link href={"/"}>
            <span className="page-title-icon bg-gradient-primary text-white me-2">
              <i className="mdi mdi-home"></i>
            </span>
          </Link>
          <ol className="breadcrumb" style={{ border: "0px", padding: "0px" }}>
            <li className="breadcrumb-item">
              <Link href="/">{parent}</Link>
            </li>
            {pathArray.map((path, index) => {
              const href = '/' + pathArray.slice(0, index + 1).join('/');
              const isLast = index === pathArray.length - 1;
              path = decodeURIComponent((path + '').replace(/\+/g, '%20'))
              return (
                <li
                  key={index}
                  className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {!isLast ? (
                    <Link href={href}>{toNormalCase(path.charAt(0).toUpperCase() + path.slice(1))}</Link>
                  ) : (
                    toNormalCase(path.charAt(0).toUpperCase() + path.slice(1))
                  )}
                </li>
              );
            })}
          </ol>
        </>
      }
    </nav>

  );
};

export default Breadcrumb;