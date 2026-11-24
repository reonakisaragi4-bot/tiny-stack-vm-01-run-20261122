import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const IM='014'+'0'.repeat(45)+'2222'+'0'.repeat(32);
const PO='00011223'+'0'.repeat(8)+'2222222'+'1'+'222'+'1'+'2222222'+'0'.repeat(13)+'011'+'0'.repeat(13)+'12'+'0'.repeat(14)+'1101';
const PU='01102333'+'0'.repeat(8)+'1'.repeat(19)+'0'.repeat(29)+'1'+'0'.repeat(17)+'10';
function run(p,q){
 const S=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,n=0,pc=0,t=0,ip=0;
 const E=x=>({o:o.slice(0,n),x});
 for(;;){
  if(t==1e6)return E(10);
  if(pc<0||pc>=p.length)return E(9);
  const op=p[pc],im=IM.charCodeAt(op)-48,po=PO.charCodeAt(op)-48,pu=PU.charCodeAt(op)-48;
  if(pc+im>=p.length)return E(9);
  t++;
  const nx=pc+1+im;
  if(s<po)return E(2);
  if(s-po+pu>256)return E(3);
  pc=nx;
  switch(op){
   case 0:return E(0);
   case 1:S[s++]=(p[nx-1]<<24)>>24;break;
   case 2:S[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:S[s]=S[s-1];s++;break;
   case 5:{const a=S[s-1];S[s-1]=S[s-2];S[s-2]=a;break}
   case 6:S[s]=S[s-2];s++;break;
   case 7:{const a=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=a;break}
   case 23:S[s-1]=-S[s-1]|0;break;
   case 27:S[s-1]=~S[s-1];break;
   case 48:pc=nx+((p[nx-2]|p[nx-1]<<8)<<16>>16);break;
   case 49:case 50:{const v=S[--s];if(op==49?v==0:v!=0)pc=nx+((p[nx-2]|p[nx-1]<<8)<<16>>16);break}
   case 51:if(c==64)return E(7);C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(!c)return E(8);pc=C[--c];break;
   case 64:{const a=S[s-1];if(a<0||a>255)return E(6);S[s-1]=M[a];break}
   case 65:{const a=S[s-1],v=S[s-2];if(a<0||a>255)return E(6);s-=2;M[a]=v;break}
   case 80:{const b=String(S[s-1]);if(n+b.length>65536)return E(11);s--;for(let i=0;i<b.length;i++)o[n++]=b.charCodeAt(i);break}
   case 81:if(n+1>65536)return E(11);o[n++]=S[--s]&255;break;
   case 82:S[s++]=ip<q.length?q[ip++]:-1;break;
   case 83:return E(S[--s]&255);
   default:
    if(op<16||op>34)return E(5);
    const b=S[s-1],a=S[s-2];let r;
    if(op==16)r=a+b|0;
    else if(op==17)r=a-b|0;
    else if(op==18)r=Math.imul(a,b);
    else if(op==19){if(!b)return E(4);r=a==-2147483648&&b==-1?a:(a/b)|0}
    else if(op==20){if(!b)return E(4);r=b==-1?0:a%b|0}
    else if(op==21){if(!b)return E(4);r=Math.floor((a>>>0)/(b>>>0))|0}
    else if(op==22){if(!b)return E(4);r=(a>>>0)%(b>>>0)|0}
    else if(op==24)r=a&b;
    else if(op==25)r=a|b;
    else if(op==26)r=a^b;
    else if(op==28)r=a<<(b&31);
    else if(op==29)r=a>>(b&31);
    else if(op==30)r=(a>>>(b&31))|0;
    else if(op==32)r=a==b?1:0;
    else if(op==33)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    s-=2;S[s++]=r;
  }
 }
}
for(const d of readdirSync(I).sort()){
 const r=run(readFileSync(join(I,d,'program.bin')),readFileSync(join(I,d,'input.bin')));
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,'stdout.bin'),r.o);
 writeFileSync(join(O,d,'exit.txt'),r.x+'\n');
}
